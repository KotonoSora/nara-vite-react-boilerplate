import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale/en-US";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

/**
 * Cache to store synchronously accessible date-fns locales once loaded
 */
const syncLocaleCache = new Map<SupportedLanguage, Locale>();

/**
 * Returns the locale object corresponding to the provided language code.
 * Falls back to the English locale if the specified language is not found or not yet loaded.
 *
 * Note: This function returns synchronously. For initial loads, use `ensureDateFnsLocaleLoaded`
 * to preload the locale asynchronously.
 *
 * @function getDateFNSLocaleByLanguage
 * @param {SupportedLanguage|string} language - The language code (e.g., 'en', 'es', 'fr', ...) to retrieve the locale for.
 * @returns {Locale} The locale object associated with the given language code, or the English locale as a fallback.
 */
export function getDateFNSLocaleByLanguage(
  language: SupportedLanguage | string,
): Locale {
  const locale = syncLocaleCache.get(language as SupportedLanguage);
  return locale || enUS; // fallback to English
}

/**
 * Ensures date-fns locale is loaded and cached for synchronous access.
 * This should be called during app initialization for the current language.
 *
 * @param language - The language to ensure is loaded
 */
export async function ensureDateFnsLocaleLoaded(
  language: SupportedLanguage,
): Promise<void> {
  if (!syncLocaleCache.has(language)) {
    const { loadDateFnsLocale } = await import("./load-date-fns-locale");
    const locale = await loadDateFnsLocale(language);
    syncLocaleCache.set(language, locale);
  }
}
