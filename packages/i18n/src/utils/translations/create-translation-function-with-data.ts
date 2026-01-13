import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import type {
  NestedTranslationObject,
  TranslationKey,
} from "../../types/translations";

import { getNestedValue } from "./get-nested-value";

/**
 * Retrieves a translated string for the specified language and key.
 *
 * This function looks up a translation in the following order:
 * 1. Attempts to find the translation in the requested language
 * 2. Falls back to the default language if not found
 * 3. Returns the key itself as a last resort (with a console warning)
 *
 * Supports parameter interpolation using the `{{paramKey}}` syntax in translation strings.
 *
 * @param translations - The translations object containing a language translations
 * @param language - The target language for the translation
 * @param key - The translation key using dot notation (e.g., "common.button.submit")
 * @param params - Optional key-value pairs for parameter replacement in the translation string
 * @returns The translated string with parameters replaced, or the key itself if no translation is found
 *
 * @example
 * ```typescript
 * // Simple translation
 * getTranslation('en', 'common.greeting') // Returns: "Hello"
 *
 * // Translation with parameters
 * getTranslation('en', 'user.welcome', { name: 'John' }) // Returns: "Welcome, John"
 * ```
 */
export const createTranslationFunctionWithData =
  (translations: NestedTranslationObject, language: SupportedLanguage) =>
  (key: TranslationKey, params?: Record<string, string | number>) => {
    // Try to get translation from the requested language
    let translation = getNestedValue(translations, key);

    // Final fallback to the key itself if nothing is found
    let translatedString: string;
    if (translation === undefined) {
      console.warn(
        `Translation not found for key: ${key} in language: ${language}`,
      );
      translatedString = key;
    } else {
      translatedString = String(translation);
    }

    // Handle parameter replacement
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translatedString = translatedString.replace(
          new RegExp(`{{${paramKey}}}`, "g"),
          String(value),
        );
      });
    }

    return translatedString;
  };
