import { data } from "react-router";
import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).verify-email";

import { VerifyEmailPage } from "~/features/verify-email/page";
import { useI18n } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";
import { verifyEmailWithToken } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const pageMeta = {
    pageTitle: t("auth.verifyEmail.title"),
    pageDescription: t("auth.verifyEmail.description"),
  };

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // Create schema with localized error message
  const verifyEmailSchema = z.object({
    token: z.string().min(1, t("auth.verifyEmail.validation.tokenRequired")),
  });

  // Validate the token using the schema
  const validationResult = verifyEmailSchema.safeParse({ token });

  if (!validationResult.success) {
    const errors = validationResult.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return data({ error: errors, pageMeta }, { status: 400 });
  }

  const { db } = context;

  try {
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

      return data(
        { error: errorMessage, errorCode: result.errorCode, pageMeta },
        { status: 400 },
      );
    }

    return data({
      success: true,
      message: t("auth.verifyEmail.success.message"),
      pageMeta,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return data(
      { error: t("auth.verifyEmail.errors.somethingWentWrong"), pageMeta },
      { status: 500 },
    );
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.pageMeta?.pageTitle ?? "Email Verification";
  const description =
    loaderData?.pageMeta?.pageDescription ?? "Verify your email address";

  return [
    { title: `${title} - NARA` },
    { name: "description", content: description },
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
