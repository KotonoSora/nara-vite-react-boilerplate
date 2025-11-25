import type { Locale } from "date-fns";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

import { DATE_FNS_LOCALE_MAP } from "~/lib/i18n/constants/date-fns-locale-map";

/**
 * Returns the locale object corresponding to the provided language code.
 * Falls back to the English locale if the specified language is not found.
 *
 * @function getDateFNSLocaleByLanguage
 * @param {SupportedLanguage|string} language - The language code (e.g., 'en', 'es', 'fr', ...) to retrieve the locale for.
 * @returns {Locale} The locale object associated with the given language code, or the English locale as a fallback.
 */
export function getDateFNSLocaleByLanguage(
  language: SupportedLanguage | string,
): Locale {
  return DATE_FNS_LOCALE_MAP[language] || DATE_FNS_LOCALE_MAP.en; // fallback to English
}
