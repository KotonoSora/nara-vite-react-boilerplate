import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";
import type { ResetPasswordPageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export const { pageMiddlewareContext } =
  createMiddlewareContext<ResetPasswordPageInformation>(
    "pageMiddlewareContext",
  );

export const pageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  context.set(pageMiddlewareContext, {
    title: t("auth.resetPassword.title"),
    description: t("auth.resetPassword.description"),
    language,
  });

  return await next();
};
