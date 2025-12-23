import type { Route } from "./+types/($lang).forgot-password";

import type { MiddlewareFunction } from "react-router";

import {
  forgotPasswordMiddleware,
  forgotPasswordMiddlewareContext,
} from "~/features/forgot-password/middleware/forgot-password-middleware";
import { ForgotPasswordPage } from "~/features/forgot-password/page";
import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [forgotPasswordMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const forgotPasswordContent = context.get(forgotPasswordMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...forgotPasswordContent };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { t } = context.get(I18nReactRouterContext);
  const formData = await request.formData();

  const { z } = await import("zod");

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

  const { requestPasswordReset } =
    await import("~/lib/authentication/server/user.server");

  await requestPasswordReset(db, email, baseUrl);

  return {
    success: true,
    message: t("auth.forgotPassword.successMessage"),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function ForgotPassword({}: Route.ComponentProps) {
  return <ForgotPasswordPage />;
}
