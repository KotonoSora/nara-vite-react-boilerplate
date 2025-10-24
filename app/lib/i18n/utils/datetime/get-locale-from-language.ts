import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

/**
 * Returns the locale string corresponding to a given supported language.
 *
 * @param language - The language code to map to a locale.
 * @returns The locale string associated with the provided language.
 */
export function getLocaleFromLanguage(language: SupportedLanguage): string {
  return LOCALE_MAP[language];
}
