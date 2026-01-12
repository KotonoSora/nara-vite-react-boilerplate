import type { SupportedLanguage } from "../types/common";
import type { NestedTranslationObject } from "../types/translations";

// Import translation files
import { arabicTranslations } from "./locales/arabic";
import { chineseTranslations } from "./locales/chinese";
import { englishTranslations } from "./locales/english";
import { frenchTranslations } from "./locales/french";
import { hindiTranslations } from "./locales/hindi";
import { japaneseTranslations } from "./locales/japanese";
import { spanishTranslations } from "./locales/spanish";
import { thaiTranslations } from "./locales/thai";
import { vietnameseTranslations } from "./locales/vietnamese";

/**
 * A record mapping supported language codes to their respective translation objects.
 *
 * This constant serves as the central registry for all application translations,
 * providing a type-safe way to access localized content across the application.
 *
 * @example
 * ```typescript
 * // Access English translations
 * const englishContent = translations.en;
 *
 * // Get translation for a specific language
 * const currentLanguage: SupportedLanguage = 'fr';
 * const currentTranslations = translations[currentLanguage];
 * ```
 */
export const translations: Record<SupportedLanguage, NestedTranslationObject> =
  {
    en: englishTranslations,
    es: spanishTranslations,
    fr: frenchTranslations,
    zh: chineseTranslations,
    hi: hindiTranslations,
    ar: arabicTranslations,
    vi: vietnameseTranslations,
    ja: japaneseTranslations,
    th: thaiTranslations,
  };
