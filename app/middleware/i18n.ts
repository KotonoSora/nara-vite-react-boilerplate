import {
  createTranslationFunctionWithData,
  getIntlLocaleByLanguage,
} from "@kotonosora/i18n";
import { createContext } from "react-router";

import type {
  NestedTranslationObject,
  TranslationFunction,
} from "@kotonosora/i18n-locales";
import type { SupportedLanguage } from "@kotonosora/i18n-types";
import type { MiddlewareFunction } from "react-router";

import { loadDataTranslations } from "~/lib/i18n/server/load-data-translations.server";
import { resolveRequestLanguage } from "~/lib/i18n/server/request-language.server";

export type I18nReactRouterContextType = {
  language: SupportedLanguage;
  t: TranslationFunction;
  locale: string;
};

export const I18nReactRouterContext =
  createContext<I18nReactRouterContextType>();

export const i18nMiddleware: MiddlewareFunction = async (
  { request, context, url },
  next,
) => {
  const language: SupportedLanguage = await resolveRequestLanguage(
    request,
    url,
  );
  const translations: NestedTranslationObject =
    await loadDataTranslations(language);
  const t = createTranslationFunctionWithData(translations, language);
  const locale = getIntlLocaleByLanguage(language);

  context.set(I18nReactRouterContext, { language, t, locale });

  return await next();
};
