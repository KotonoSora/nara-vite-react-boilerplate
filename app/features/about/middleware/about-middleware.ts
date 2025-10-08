import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

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
  const { language, t } = context.get(I18nContext);

  const contextValue: AboutPageContextType = {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    language,
  };

  context.set(aboutMiddlewareContext, contextValue);
};
