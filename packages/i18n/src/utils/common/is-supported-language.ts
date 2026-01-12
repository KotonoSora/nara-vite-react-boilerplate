import type { SupportedLanguage } from "../../types/common";

import { SUPPORTED_LANGUAGES } from "../../constants/common";

/**
 * Type guard that checks if a given language string is a supported language.
 *
 * @param lang - The language string to check
 * @returns True if the language is in the list of supported languages, false otherwise
 *
 * @example
 * ```ts
 * if (isSupportedLanguage('en')) {
 *   // lang is typed as SupportedLanguage
 * }
 * ```
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}
