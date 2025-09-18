import { createContext } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";

import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export type I18nContextType = {
  language: SupportedLanguage;
};

export const I18nContext = createContext<I18nContextType>();

export const i18nMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  context.set(I18nContext, { language });
};
