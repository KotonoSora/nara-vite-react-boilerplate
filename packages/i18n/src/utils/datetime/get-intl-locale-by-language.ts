import type { SupportedLanguage } from "../../types/common";

import { INTL_LOCALE_MAP } from "../../constants/intl-locale-map";

/**
 * Returns the corresponding Intl locale string for a given language.
 *
 * @function getIntlLocaleByLanguage
 * @param {SupportedLanguage|string} language - The language code to look up, either as a `SupportedLanguage` or a string.
 * @returns {string} The Intl locale string mapped to the provided language, or the English locale as a fallback if the language is not found.
 */
export function getIntlLocaleByLanguage(
  language: SupportedLanguage | string,
): string {
  return INTL_LOCALE_MAP[language as SupportedLanguage] || INTL_LOCALE_MAP.en; // fallback to English
}
