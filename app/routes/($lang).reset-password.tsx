import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).reset-password";

import { isStrongPassword } from "~/lib/auth/config";
import { createTranslationFunction, useI18n } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { resetPasswordWithToken } from "~/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const language = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return redirect("/forgot-password");
    }

    return {
      token,
      pageTitle: t("auth.resetPassword.title"),
      pageDescription: t("auth.resetPassword.description"),
    };
  } catch (error) {
    return null;
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const formData = await request.formData();

  const resetPasswordSchema = z
    .object({
      token: z.string().min(1, t("auth.resetPassword.errorMissingToken")),
      password: z
        .string()
        .min(8, t("auth.resetPassword.errorPasswordTooShort")),
      confirmPassword: z
        .string()
        .min(1, t("auth.resetPassword.errorConfirmPasswordMissing")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.resetPassword.errorPasswordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  const result = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;
    return data({ errors }, { status: 400 });
  }

  const { token, password } = result.data;

  // Check password strength
  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck.isValid) {
    return data(
      {
        errors: {
          password: [t("auth.resetPassword.errorWeakPassword")],
        },
      },
      { status: 400 },
    );
  }

  const { db } = context;

  try {
    const resetResult = await resetPasswordWithToken(db, token, password);

    if (!resetResult.success) {
      return data({ error: resetResult.error }, { status: 400 });
    }

    return redirect("/login?reset=success");
  } catch (error) {
    console.error("Password reset error:", error);
    return data(
      { error: t("auth.resetPassword.errorGeneral") },
      { status: 500 },
    );
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [
      { title: "Reset Password - NARA" },
      { name: "description", content: "Set a new password for your account" },
    ];
  }

  return [
    { title: loaderData.pageTitle },
    { name: "description", content: loaderData.pageDescription },
  ];
}

export default function ResetPassword({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  if (!loaderData) return null;
  const { token } = loaderData;

  const { t } = useI18n();

  // Handle different action data types
  let errors: Record<string, string[]> | undefined;
  let error: string | undefined;

  if (actionData) {
    if ("errors" in actionData) {
      errors = actionData.errors;
    } else if ("error" in actionData) {
      error = actionData.error;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("auth.resetPassword.heading")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("auth.resetPassword.subheading")}
          </p>
        </div>
        <form className="mt-8 space-y-6" method="post">
          <input type="hidden" name="token" value={token} />

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                {t("auth.resetPassword.passwordLabel")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t("auth.resetPassword.passwordPlaceholder")}
              />
              {errors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password[0]}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t("auth.resetPassword.confirmPasswordLabel")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
              />
              {errors?.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {t("auth.resetPassword.errorPasswordsDoNotMatch")}
                </p>
              )}
            </div>
          </div>

          <div className="text-sm">
            <p className="text-gray-600">
              {t("auth.resetPassword.passwordRequirements")}
            </p>
            <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
              <li>{t("auth.resetPassword.requirementLength")}</li>
              <li>{t("auth.resetPassword.requirementUppercase")}</li>
              <li>{t("auth.resetPassword.requirementLowercase")}</li>
              <li>{t("auth.resetPassword.requirementNumber")}</li>
              <li>{t("auth.resetPassword.requirementSpecial")}</li>
            </ul>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("auth.resetPassword.submitButton")}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("auth.resetPassword.backToSignIn")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
