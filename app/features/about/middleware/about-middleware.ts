import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export type AboutPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
};

export const { aboutMiddlewareContext } =
  createMiddlewareContext<AboutPageContextType>("aboutMiddlewareContext");

export const aboutMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const contextValue: AboutPageContextType = {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    language,
  };

  context.set(aboutMiddlewareContext, contextValue);
  return next();
};
