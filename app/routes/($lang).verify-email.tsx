import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).verify-email";

import { VerifyEmailPage } from "~/features/verify-email/page";
import { createTranslationFunction } from "~/lib/i18n";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { db } = context;

  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  // Create schema with localized error message
  const verifyEmailSchema = z.object({
    token: z.string().min(1, t("auth.verifyEmail.validation.tokenRequired")),
  });
  // Validate the token using the schema
  const validationResult = verifyEmailSchema.safeParse({ token });
  if (!validationResult.success) {
    return {
      title: t("auth.verifyEmail.title"),
      description: t("auth.verifyEmail.description"),
      error: t("auth.verifyEmail.validation.tokenRequired"),
      errorCode: "REQUIRED_TOKEN",
    };
  }

  const { verifyEmailWithToken } = await import("~/lib/auth/user.server");

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
      title: t("auth.verifyEmail.title"),
      description: t("auth.verifyEmail.description"),
      error: errorMessage,
      errorCode: result.errorCode,
    };
  }

  return {
    title: t("auth.verifyEmail.title"),
    description: t("auth.verifyEmail.description"),
    success: true,
    message: t("auth.verifyEmail.success.message"),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!("title" in loaderData) || !("description" in loaderData)) {
    return [
      {
        title: "Email Verification",
      },
      {
        name: "description",
        content: "Verify your email address",
      },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
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
