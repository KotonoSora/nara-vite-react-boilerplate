import { data } from "react-router";
import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).verify-email";

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
  const { t } = useI18n();
  const isSuccess = loaderData && "success" in loaderData && loaderData.success;
  const error = loaderData && "error" in loaderData ? loaderData.error : null;
  const message =
    loaderData && "message" in loaderData ? loaderData.message : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("auth.verifyEmail.title")}
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {isSuccess ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {t("auth.verifyEmail.success.title")}
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{message}</p>
                  </div>
                  <div className="mt-4">
                    <a
                      href="/login"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {t("auth.verifyEmail.success.goToSignIn")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {t("auth.verifyEmail.error.title")}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <a
                      href="/login"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {t("auth.verifyEmail.error.backToSignIn")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
