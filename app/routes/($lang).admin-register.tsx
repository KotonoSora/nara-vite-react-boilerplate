import { useState } from "react";
import { Form, redirect, useActionData, useLoaderData } from "react-router";

import type { Route } from "./+types/($lang).admin-register";

import { getLanguageSession } from "~/language.server";
import { logSecurityAccess } from "~/lib/auth/route-security.server";
import { DEFAULT_LANGUAGE, getLanguageFromPath } from "~/lib/i18n/config";
import { createTranslationFunction } from "~/lib/i18n/translations";
import { createUser, getUserByEmail } from "~/user.server";

const ADMIN_SECRET =
  process.env.ADMIN_REGISTRATION_SECRET || "nara-admin-secret-2024";

export async function action({ request, context, params }: Route.ActionArgs) {
  const { db } = context;

  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const adminSecret = formData.get("adminSecret")?.toString();

  // Validate required fields
  if (!email || !password || !name || !adminSecret) {
    return { error: "All fields are required" };
  }

  // Verify admin secret
  if (adminSecret !== ADMIN_SECRET) {
    await logSecurityAccess(db, null, request, "/admin-register", "critical", {
      action: "admin_register_failed",
      reason: "invalid_secret",
      email,
    });
    return { error: "Invalid admin secret. Contact system administrator." };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email format" };
  }

  // Validate password strength
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(db, email);
    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    // Create admin user
    const newAdmin = await createUser(
      db,
      {
        email,
        password,
        name,
        role: "admin",
        // Admin accounts created via secret registration have no creator
        createdBy: null,
      },
      {
        sendVerificationEmail: true,
        baseUrl: new URL(request.url).origin,
      },
    );

    // Log successful admin registration
    await logSecurityAccess(
      db,
      newAdmin.id,
      request,
      "/admin-register",
      "critical",
      {
        action: "admin_registered",
        adminId: newAdmin.id,
      },
    );

    // Get language for redirect
    const url = new URL(request.url);
    const pathLanguage = getLanguageFromPath(url.pathname);
    const languageSession = await getLanguageSession(request);
    const cookieLanguage = languageSession.getLanguage();
    const language = pathLanguage || cookieLanguage || DEFAULT_LANGUAGE;

    // Redirect to login with success message
    const redirectPath =
      language === DEFAULT_LANGUAGE ? "/login" : `/${language}/login`;
    return redirect(`${redirectPath}?message=admin-registered`);
  } catch (error) {
    console.error("Admin registration error:", error);
    return { error: "Registration failed. Please try again." };
  }
}

export async function loader({ request, params }: Route.LoaderArgs) {
  // Handle language detection
  const url = new URL(request.url);
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const language = pathLanguage || cookieLanguage || DEFAULT_LANGUAGE;

  return { language };
}

export default function AdminRegister() {
  const actionData = useActionData<typeof action>();
  const { language } = useLoaderData<typeof loader>();
  const [showSecret, setShowSecret] = useState(false);

  const t = createTranslationFunction(language);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t("admin.registerTitle") || "Admin Registration"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("admin.registerSubtitle") ||
              "Create a new administrator account"}
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Restricted Access:</strong> This page requires a valid
                  admin secret key. Contact your system administrator for
                  access.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Form className="mt-8 space-y-6" method="post">
          {actionData?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t("auth.name") || "Full Name"}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t("auth.namePlaceholder") || "Enter full name"}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("auth.email") || "Email Address"}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={
                  t("auth.register.form.email.placeholder") ||
                  t("auth.emailPlaceholder") ||
                  "Enter email address"
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t("auth.password") || "Password"}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={
                  t("auth.register.form.password.placeholder") ||
                  t("auth.passwordPlaceholder") ||
                  "Enter password (min 8 characters)"
                }
              />
            </div>

            <div>
              <label
                htmlFor="adminSecret"
                className="block text-sm font-medium text-gray-700"
              >
                {t("admin.secret") || "Admin Secret Key"}
              </label>
              <div className="mt-1 relative">
                <input
                  id="adminSecret"
                  name="adminSecret"
                  type={showSecret ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={
                    t("admin.secretPlaceholder") || "Enter admin secret key"
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Contact your system administrator for the admin secret key.
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-red-500 group-hover:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              {t("admin.registerButton") || "Register Admin Account"}
            </button>
          </div>

          <div className="text-center">
            <a
              href={
                language === DEFAULT_LANGUAGE ? "/login" : `/${language}/login`
              }
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("auth.backToLogin") || "← Back to Login"}
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
