import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).reset-password";

import { resetPasswordWithToken } from "~/user.server";
import { isStrongPassword } from "~/lib/auth/config";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect("/forgot-password");
  }

  return { token };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return data({ errors }, { status: 400 });
  }

  const { token, password } = result.data;

  // Check password strength
  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck.isValid) {
    return data({
      errors: {
        password: ["Password must contain at least 8 characters with uppercase, lowercase, number, and special character"],
      },
    }, { status: 400 });
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
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password - NARA" },
    { name: "description", content: "Set a new password for your account" },
  ];
}

export default function ResetPassword({ loaderData, actionData }: Route.ComponentProps) {
  const { token } = loaderData;
  
  // Handle different action data types
  let errors: Record<string, string[]> | undefined;
  let error: string | undefined;
  
  if (actionData) {
    if ('errors' in actionData) {
      errors = actionData.errors;
    } else if ('error' in actionData) {
      error = actionData.error;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter a strong password for your account
          </p>
        </div>
        <form className="mt-8 space-y-6" method="post">
          <input type="hidden" name="token" value={token} />
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New password"
              />
              {errors?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm new password"
              />
              {errors?.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword[0]}</p>
              )}
            </div>
          </div>

          <div className="text-sm">
            <p className="text-gray-600">Password must contain:</p>
            <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Password
            </button>
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}