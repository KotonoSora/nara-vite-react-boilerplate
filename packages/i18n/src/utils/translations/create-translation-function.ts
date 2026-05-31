import type { TranslationKey } from "@kotonosora/i18n-locales";
import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { getTranslation } from "./get-translation";

/**
 * Creates a translation function for the specified language.
 *
 * @param language - The language to use for translations.
 * @returns A function that takes a translation key and optional parameters,
 *          and returns the translated string for the given language.
 */
export function createTranslationFunction<TKey extends string = TranslationKey>(
  language: SupportedLanguage,
) {
  return (key: TKey, params?: Record<string, string | number>) =>
    getTranslation<TKey>(language, key, params);
}
