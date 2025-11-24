import { createContext } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/types/common";
import type { TranslationFunction } from "~/lib/i18n/types/translations";

import { resolveRequestLanguage } from "~/lib/i18n/server/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/utils/translations/create-translation-function";

export type I18nContextType = {
  language: SupportedLanguage;
  t: TranslationFunction;
};

export const I18nContext = createContext<I18nContextType>();

export const i18nMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  context.set(I18nContext, { language, t });

  return await next();
};
