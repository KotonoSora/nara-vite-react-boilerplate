import type { SupportedLanguage } from "../../types/common";
import type { TranslationKey } from "../../types/translations";

import { getNestedValue } from "./get-nested-value";
import { loadTranslations } from "./load-translations";

/**
 * Cache to store synchronously accessible translations once loaded
 */
const syncTranslationCache = new Map<SupportedLanguage, any>();

/**
 * Retrieves a translated string for the specified language and key synchronously.
 *
 * This function looks up a translation from the cache. If translations haven't been loaded yet,
 * it returns the key itself as a fallback.
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
  const languageTranslations = syncTranslationCache.get(language);

  // If translations not loaded yet, return key as fallback
  if (!languageTranslations) {
    return key;
  }

  // Try to get translation from the requested language
  let translation = getNestedValue(languageTranslations, key);

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

/**
 * Ensures translations are loaded and cached for synchronous access.
 * This should be called during app initialization.
 *
 * @param language - The language to ensure is loaded
 */
export async function ensureTranslationsLoaded(
  language: SupportedLanguage,
): Promise<void> {
  if (!syncTranslationCache.has(language)) {
    const translations = await loadTranslations(language);
    syncTranslationCache.set(language, translations);
  }
}
