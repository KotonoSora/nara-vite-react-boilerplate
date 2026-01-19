import type { NestedTranslationObject, SupportedLanguage } from "../types";

// Import translation files
import { arabicTranslations } from "./ar";
import { englishTranslations } from "./en";
import { spanishTranslations } from "./es";
import { frenchTranslations } from "./fr";
import { hindiTranslations } from "./hi";
import { japaneseTranslations } from "./ja";
import { thaiTranslations } from "./th";
import { vietnameseTranslations } from "./vi";
import { chineseTranslations } from "./zh";

export * from "./ar";
export * from "./zh";
export * from "./en";
export * from "./fr";
export * from "./hi";
export * from "./ja";
export * from "./es";
export * from "./th";
export * from "./vi";

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
