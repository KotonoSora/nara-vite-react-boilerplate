import type { SupportedLanguage } from "../../types/common";
import type { TranslationKey } from "../../types/translations";

import { getTranslation } from "./get-translation";

/**
 * Creates a translation function for the specified language.
 *
 * @param language - The language to use for translations.
 * @returns A function that takes a translation key and optional parameters,
 *          and returns the translated string for the given language.
 */
export function createTranslationFunction(language: SupportedLanguage) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(language, key, params);
}
