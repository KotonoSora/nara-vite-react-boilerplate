import type { SupportedLanguage } from "~/lib/i18n";
import type { MiddlewareFunction } from "react-router";
import type { PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export const { pageMiddlewareContext } =
  createMiddlewareContext<PageInformation>("pageMiddlewareContext");

export const pageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  context.set(pageMiddlewareContext, {
    title: t("auth.verifyEmail.title"),
    description: t("auth.verifyEmail.description"),
    language,
  });

  return await next();
};
