import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { RTL_LANGUAGES } from "../../constants/rtl";

/**
 * Determines whether the specified language uses right-to-left (RTL) text direction.
 *
 * @param language - The language code to check against the list of RTL languages
 * @returns `true` if the language is an RTL language, `false` otherwise
 *
 * @example
 * ```typescript
 * isRTLLanguage('ar'); // returns true for Arabic
 * isRTLLanguage('en'); // returns false for English
 * ```
 */
export function isRTLLanguage(language: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(language);
}
