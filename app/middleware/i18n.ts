import { createTranslationFunctionWithData } from "@kotonosora/i18n";
import { createContext } from "react-router";

import type {
  NestedTranslationObject,
  SupportedLanguage,
  TranslationFunction,
} from "@kotonosora/i18n-locales";
import type { MiddlewareFunction } from "react-router";

import { loadDataTranslations } from "~/lib/i18n/server/load-data-translations.server";
import { resolveRequestLanguage } from "~/lib/i18n/server/request-language.server";

export type I18nReactRouterContextType = {
  language: SupportedLanguage;
  t: TranslationFunction;
};

export const I18nReactRouterContext =
  createContext<I18nReactRouterContextType>();

export const i18nMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const translations: NestedTranslationObject =
    await loadDataTranslations(language);
  const t = createTranslationFunctionWithData(translations, language);

  context.set(I18nReactRouterContext, { language, t });

  return await next();
};
