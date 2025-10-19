import type { SupportedLanguage } from "../types/common";
import type {
  NestedTranslationObject,
  TranslationKey,
} from "../types/translations";

import { DEFAULT_LANGUAGE } from "../constants/common";
import { translations } from "../constants/translations";

/**
 * Retrieves a nested value from an object using a dot-notation path string.
 *
 * @param obj - The nested translation object to traverse
 * @param path - A dot-separated string representing the path to the desired value (e.g., "user.profile.name")
 * @returns The string value at the specified path, or undefined if the path doesn't exist or the value is not a string
 *
 * @example
 * ```typescript
 * const translations = { user: { profile: { name: "John" } } };
 * getNestedValue(translations, "user.profile.name"); // Returns "John"
 * getNestedValue(translations, "user.invalid.path"); // Returns undefined
 * ```
 */
function getNestedValue(
  obj: NestedTranslationObject,
  path: string,
): string | undefined {
  return path.split(".").reduce<unknown>((current, key) => {
    return current &&
      typeof current === "object" &&
      current !== null &&
      key in current
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj) as string | undefined;
}

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
export function getTranslation(
  language: SupportedLanguage,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const languageTranslations = translations[language];
  const fallbackTranslations = translations[DEFAULT_LANGUAGE];

  // Try to get translation from the requested language
  let translation = getNestedValue(languageTranslations, key);

  // Fallback to default language if translation not found
  if (translation === undefined) {
    translation = getNestedValue(fallbackTranslations, key);
  }

  // Final fallback to the key itself if nothing is found
  if (translation === undefined) {
    console.warn(
      `Translation not found for key: ${key} in language: ${language}`,
    );
    translation = key;
  }

  // Handle parameter replacement
  if (params && typeof translation === "string") {
    Object.entries(params).forEach(([paramKey, value]) => {
      translation = translation!.replace(
        new RegExp(`{{${paramKey}}}`, "g"),
        String(value),
      );
    });
  }

  return translation;
}

export function createTranslationFunction(language: SupportedLanguage) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(language, key, params);
}

export type TranslationFunctionType = ReturnType<
  typeof createTranslationFunction
>;
