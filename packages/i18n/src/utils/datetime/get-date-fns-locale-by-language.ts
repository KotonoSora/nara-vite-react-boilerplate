import type { SupportedLanguage } from "@kotonosora/i18n-locales";
import type { Locale } from "date-fns";

import { DATE_FNS_LOCALE_MAP } from "../../constants/date-fns-locale-map";

/**
 * Cache for loaded date-fns locales to avoid re-importing
 */
const localeCacheMap = new Map<SupportedLanguage, Locale>();

/**
 * Loads a date-fns locale for a specific language from the shared static locale map.
 * The async API is preserved for compatibility with existing callers.
 *
 * @param language - The language code to load locale for
 * @returns Promise resolving to the date-fns Locale object
 *
 * @example
 * ```typescript
 * const locale = await loadDateFnsLocale('en');
 * const formatted = format(new Date(), 'PPP', { locale });
 * ```
 */
export async function loadDateFnsLocale(
  language: SupportedLanguage,
): Promise<Locale> {
  // Return cached locale if already loaded
  if (localeCacheMap.has(language)) {
    return localeCacheMap.get(language)!;
  }

  const locale =
    (DATE_FNS_LOCALE_MAP[language] as Locale | undefined) ||
    (DATE_FNS_LOCALE_MAP.en as Locale);

  // Cache the loaded locale
  localeCacheMap.set(language, locale);

  return locale;
}

/**
 * Returns the locale object corresponding to the provided language code.
 * Falls back to the English locale if the specified language is not found.
 *
 * @function getDateFNSLocaleByLanguage
 * @param {SupportedLanguage|string} language - The language code (e.g., 'en', 'es', 'fr', ...) to retrieve the locale for.
 * @returns {Locale} The locale object associated with the given language code, or the English locale as a fallback.
 */
export async function getDateFNSLocaleByLanguage(
  language: SupportedLanguage | string,
): Promise<Locale> {
  return await loadDateFnsLocale(language as SupportedLanguage);
}
