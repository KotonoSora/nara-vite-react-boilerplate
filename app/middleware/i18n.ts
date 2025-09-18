import { createContext } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/config";
import type { TranslationFunctionType } from "~/lib/i18n/translations";
import type { MiddlewareFunction } from "react-router";

import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export type I18nContextType = {
  language: SupportedLanguage;
  t: TranslationFunctionType;
};

export const I18nContext = createContext<I18nContextType>();

export const i18nMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  context.set(I18nContext, { language, t });
};
