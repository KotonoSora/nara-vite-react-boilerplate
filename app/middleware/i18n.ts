import { createContext } from "react-router";

import type { SupportedLanguage } from "@kotonosora/i18n";
import type { MiddlewareFunction } from "react-router";

import type {
  NestedTranslationObject,
  TranslationFunction,
} from "~/lib/i18n/types/translations";

import { loadDataTranslations } from "~/lib/i18n/server/load-data-translations.server";
import { resolveRequestLanguage } from "~/lib/i18n/server/request-language.server";
import { createTranslationFunctionWithData } from "~/lib/i18n/utils/translations/create-translation-function-with-data";

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
