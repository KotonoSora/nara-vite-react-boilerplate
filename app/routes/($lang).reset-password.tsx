import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).reset-password";

import { PageContext } from "~/features/reset-password/context/page-context";
import { ResetPasswordPage } from "~/features/reset-password/page";
import { isStrongPassword } from "~/lib/auth/config";
import { resetPasswordWithToken } from "~/lib/auth/user.server";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request }: Route.LoaderArgs) {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect("/forgot-password");
  }

  return {
    token,
    title: t("auth.resetPassword.title"),
    description: t("auth.resetPassword.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  try {
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
      const fieldErrorMessage = Object.values(errors).flat().join(", ");

      return data({ error: fieldErrorMessage }, { status: 400 });
    }
    const { token, password } = result.data;
    // Check password strength
    const passwordCheck = isStrongPassword(password);
    if (!passwordCheck.isValid) {
      return data(
        { error: t("auth.resetPassword.errorWeakPassword") },
        { status: 400 },
      );
    }
    const { db } = context;
    const resetResult = await resetPasswordWithToken(db, token, password);
    if (!resetResult.success) {
      return data({ error: resetResult.error }, { status: 400 });
    }

    return redirect("/login?reset=success");
  } catch (error) {
    console.error("Password reset error:", error);

    return data(
      { error: t("errors.common.somethingWentWrong") },
      { status: 500 },
    );
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Reset Password" },
      { name: "description", content: "Set a new password for your account" },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function ResetPassword({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { token } = loaderData;

  return (
    <PageContext.Provider value={{ token, error: actionData?.error }}>
      <ResetPasswordPage />
    </PageContext.Provider>
  );
}
