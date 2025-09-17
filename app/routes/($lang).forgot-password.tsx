import { z } from "zod";

import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang).forgot-password";

import { PageContext } from "~/features/forgot-password/context/page-context";
import {
  forgotPasswordMiddleware,
  forgotPasswordMiddlewareContext,
} from "~/features/forgot-password/middleware/forgot-password-middleware";
import { ForgotPasswordPage } from "~/features/forgot-password/page";
import { createTranslationFunction } from "~/lib/i18n";

export const middleware: MiddlewareFunction[] = [forgotPasswordMiddleware];

export async function loader({ context }: any) {
  const forgotPasswordContent = context.get(forgotPasswordMiddlewareContext);
  return forgotPasswordContent;
}

export async function action({ request, context }: Route.ActionArgs) {
  const { language } = context.get(forgotPasswordMiddlewareContext);
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

export function meta({ loaderData }: any) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
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
