import type { Route } from "./+types/($lang).verify-email";

import type { MiddlewareFunction } from "react-router";

import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";
import {
  pageMiddleware,
  pageMiddlewareContext,
} from "~/features/verify-email/middleware/page-middleware";
import { VerifyEmailPage } from "~/features/verify-email/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [pageMiddleware];

export async function loader({ context, request }: Route.LoaderArgs) {
  const { t } = context.get(I18nReactRouterContext);
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const { title, description } = context.get(pageMiddlewareContext);
  const { db } = context;

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const { z } = await import("zod");

  // Create schema with localized error message
  const verifyEmailSchema = z.object({
    token: z.string().min(1, t("auth.verifyEmail.validation.tokenRequired")),
  });
  // Validate the token using the schema
  const validationResult = verifyEmailSchema.safeParse({ token });
  if (!validationResult.success) {
    return {
      ...generalInformation,
      ...i18nContent,
      title,
      description,
      error: t("auth.verifyEmail.validation.tokenRequired"),
      errorCode: "REQUIRED_TOKEN",
    };
  }

  const { verifyEmailWithToken } =
    await import("~/lib/authentication/server/user.server");

  // Verify the email with the token
  const result = await verifyEmailWithToken(db, validationResult.data.token);
  if (!result.success) {
    // Map error codes to localized messages
    let errorMessage: string;
    switch (result.errorCode) {
      case "INVALID_TOKEN":
      case "TOKEN_NOT_FOUND":
        errorMessage = t("auth.verifyEmail.errors.invalidToken");
        break;
      case "EXPIRED_TOKEN":
        errorMessage = t("auth.verifyEmail.errors.expiredToken");
        break;
      case "ALREADY_VERIFIED":
        errorMessage = t("auth.verifyEmail.errors.alreadyVerified");
        break;
      case "DATABASE_ERROR":
        errorMessage = t("auth.verifyEmail.errors.databaseError");
        break;
      default:
        errorMessage = result.error; // Fallback to original error message
    }
    return {
      ...generalInformation,
      ...i18nContent,
      title,
      description,
      error: errorMessage,
      errorCode: result.errorCode,
    };
  }

  return {
    ...generalInformation,
    ...i18nContent,
    title,
    description,
    success: true,
    message: t("auth.verifyEmail.success.message"),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function VerifyEmail({ loaderData }: Route.ComponentProps) {
  const isSuccess = loaderData && "success" in loaderData && loaderData.success;
  const error = loaderData && "error" in loaderData ? loaderData.error : null;
  const message =
    loaderData && "message" in loaderData ? loaderData.message : null;

  return (
    <VerifyEmailPage isSuccess={isSuccess} error={error} message={message} />
  );
}
