import type { SupportedLanguage } from "../../types/common";
import type { NestedTranslationObject } from "../../types/translations";

/**
 * Cache for loaded translations to avoid re-importing
 */
const translationCache = new Map<SupportedLanguage, NestedTranslationObject>();

/**
 * Dynamically loads translations for a specific language.
 * Only the requested language is loaded, reducing initial bundle size.
 *
 * @param language - The language code to load translations for
 * @returns Promise resolving to the translation object for the language
 *
 * @example
 * ```typescript
 * const translations = await loadTranslations('en');
 * console.log(translations.common.button.submit);
 * ```
 */
export async function loadTranslations(
  language: SupportedLanguage,
): Promise<NestedTranslationObject> {
  // Return cached translations if already loaded
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  // Dynamically import only the requested language
  let translations: NestedTranslationObject;

  switch (language) {
    case "en":
      translations = (await import("../../constants/locales/english")).englishTranslations;
      break;
    case "es":
      translations = (await import("../../constants/locales/spanish")).spanishTranslations;
      break;
    case "fr":
      translations = (await import("../../constants/locales/french")).frenchTranslations;
      break;
    case "zh":
      translations = (await import("../../constants/locales/chinese")).chineseTranslations;
      break;
    case "hi":
      translations = (await import("../../constants/locales/hindi")).hindiTranslations;
      break;
    case "ar":
      translations = (await import("../../constants/locales/arabic")).arabicTranslations;
      break;
    case "vi":
      translations = (await import("../../constants/locales/vietnamese")).vietnameseTranslations;
      break;
    case "ja":
      translations = (await import("../../constants/locales/japanese")).japaneseTranslations;
      break;
    case "th":
      translations = (await import("../../constants/locales/thai")).thaiTranslations;
      break;
    default:
      // Fallback to English if language not supported
      translations = (await import("../../constants/locales/english")).englishTranslations;
  }

  // Cache the loaded translations
  translationCache.set(language, translations);

  return translations;
}

/**
 * Preloads translations for a specific language in the background.
 * Useful for preloading likely next languages.
 *
 * @param language - The language code to preload
 */
export function preloadTranslations(language: SupportedLanguage): void {
  if (!translationCache.has(language)) {
    loadTranslations(language).catch((error) => {
      console.warn(`Failed to preload translations for ${language}:`, error);
    });
  }
}
