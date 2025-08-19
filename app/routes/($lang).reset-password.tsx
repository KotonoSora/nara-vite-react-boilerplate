import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).reset-password";

import { ResetPasswordPage } from "~/features/reset-password/page";
import { isStrongPassword } from "~/lib/auth/config";
import { createTranslationFunction } from "~/lib/i18n";
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

  return <ResetPasswordPage token={token} errors={errors} error={error} />;
}
