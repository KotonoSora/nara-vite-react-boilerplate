import { data } from "react-router";
import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).verify-email";

import { VerifyEmailPage } from "~/features/verify-email/page";
import { verifyEmailWithToken } from "~/lib/auth/user.server";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const { db } = context;
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
      return data(
        {
          title: t("auth.verifyEmail.title"),
          description: t("auth.verifyEmail.description"),
          error: t("auth.verifyEmail.validation.tokenRequired"),
          errorCode: "REQUIRED_TOKEN",
        },
        { status: 400 },
      );
    }
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
      return data(
        {
          title: t("auth.verifyEmail.title"),
          description: t("auth.verifyEmail.description"),
          error: errorMessage,
          errorCode: result.errorCode,
        },
        { status: 400 },
      );
    }

    return data({
      title: t("auth.verifyEmail.title"),
      description: t("auth.verifyEmail.description"),
      success: true,
      message: t("auth.verifyEmail.success.message"),
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return data({ error: "Failed to load page data" }, { status: 500 });
  }
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
