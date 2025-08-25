import { data } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).forgot-password";

import { PageContext } from "~/features/forgot-password/context/page-context";
import { ForgotPasswordPage } from "~/features/forgot-password/page";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { requestPasswordReset } from "~/user.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const language = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);
    return {
      pageTitle: t("auth.forgotPassword.title"),
      pageDescription: t("auth.forgotPassword.description"),
    };
  } catch (error) {
    return {};
  }
};

export async function action({ request, context }: Route.ActionArgs) {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  const formData = await request.formData();
  const forgotPasswordSchema = z.object({
    email: z.email(t("auth.forgotPassword.errorInvalidEmail")),
  });
  const result = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!result.success) {
    return data(
      { error: t("auth.forgotPassword.errorInvalidEmail") },
      { status: 400 },
    );
  }
  const { email } = result.data;
  const { db } = context;
  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    await requestPasswordReset(db, email, baseUrl);

    return data({
      success: true,
      message: t("auth.forgotPassword.successMessage"),
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return data(
      { error: t("auth.forgotPassword.errorGeneral") },
      { status: 500 },
    );
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [
      { title: "Forgot Password - NARA" },
      { name: "description", content: "Reset your password" },
    ];
  }

  return [
    { title: loaderData.pageTitle },
    { name: "description", content: loaderData.pageDescription },
  ];
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const isSuccess = actionData && "success" in actionData && actionData.success;
  const error = actionData && "error" in actionData ? actionData.error : null;
  const message =
    actionData && "message" in actionData ? actionData.message : null;

  return (
    <PageContext.Provider value={{ isSuccess, error, message }}>
      <ForgotPasswordPage />
    </PageContext.Provider>
  );
}
