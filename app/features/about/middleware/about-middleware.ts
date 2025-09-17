import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export type AboutPageContextType = {
  title: string;
  description: string;
  language: string;
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
