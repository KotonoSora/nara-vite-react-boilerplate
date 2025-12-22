import type { Locale } from "date-fns";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

/**
 * Cache for loaded date-fns locales to avoid re-importing
 */
const localeCacheMap = new Map<SupportedLanguage, Locale>();

/**
 * Dynamically loads date-fns locale for a specific language.
 * Only the requested language locale is loaded, reducing initial bundle size.
 *
 * Date-fns locales are large (~10-20KB each). Loading all 9 locales eagerly
 * adds ~100-150KB to the bundle. Dynamic loading reduces this to ~15KB per language.
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

  // Dynamically import only the requested locale
  let locale: Locale;

  switch (language) {
    case "en":
      locale = (await import("date-fns/locale/en-US")).enUS;
      break;
    case "es":
      locale = (await import("date-fns/locale/es")).es;
      break;
    case "fr":
      locale = (await import("date-fns/locale/fr")).fr;
      break;
    case "zh":
      locale = (await import("date-fns/locale/zh-CN")).zhCN;
      break;
    case "hi":
      locale = (await import("date-fns/locale/hi")).hi;
      break;
    case "ar":
      locale = (await import("date-fns/locale/ar")).ar;
      break;
    case "vi":
      locale = (await import("date-fns/locale/vi")).vi;
      break;
    case "ja":
      locale = (await import("date-fns/locale/ja")).ja;
      break;
    case "th":
      locale = (await import("date-fns/locale/th")).th;
      break;
    default:
      // Fallback to English if language not supported
      locale = (await import("date-fns/locale/en-US")).enUS;
  }

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
