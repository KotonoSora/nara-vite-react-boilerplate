import { z } from "zod";

import type { Route } from "./+types/($lang).forgot-password";

import { PageContext } from "~/features/forgot-password/context/page-context";
import { ForgotPasswordPage } from "~/features/forgot-password/page";
import { createTranslationFunction } from "~/lib/i18n";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  return {
    title: t("auth.forgotPassword.title"),
    description: t("auth.forgotPassword.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

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
    return { error: t("auth.forgotPassword.errorInvalidEmail") };
  }
  const { email } = result.data;
  const { db } = context;

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const { requestPasswordReset } = await import("~/lib/auth/user.server");

  await requestPasswordReset(db, email, baseUrl);

  return {
    success: true,
    message: t("auth.forgotPassword.successMessage"),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Forgot Password" },
      { name: "description", content: "Reset your password" },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const {
    success = false,
    error = null,
    message = null,
  } = (actionData ?? {}) as Partial<{
    success: boolean;
    error: string;
    message: string;
  }>;

  return (
    <PageContext.Provider value={{ isSuccess: success, error, message }}>
      <ForgotPasswordPage />
    </PageContext.Provider>
  );
}
