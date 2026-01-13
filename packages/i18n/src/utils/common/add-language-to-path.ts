import { DEFAULT_LANGUAGE } from "@kotonosora/i18n-locales";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { removeLanguageFromPath } from "./remove-language-from-path";

/**
 * Adds a language prefix to a pathname if the language is not the default language.
 *
 * @param pathname - The pathname to add the language prefix to
 * @param language - The language code to add as a prefix
 * @returns The pathname with the language prefix added, or the clean pathname if it's the default language.
 * If the language is not the default, returns `/{language}{pathname}` (omitting pathname if it's "/")
 *
 * @example
 * ```ts
 * addLanguageToPath('/about', 'en') // returns '/about' if 'en' is default
 * addLanguageToPath('/about', 'fr') // returns '/fr/about'
 * addLanguageToPath('/', 'fr') // returns '/fr'
 * ```
 */
export function addLanguageToPath(
  pathname: string,
  language: SupportedLanguage,
): string {
  const cleanPath = removeLanguageFromPath(pathname);
  if (language === DEFAULT_LANGUAGE) {
    return cleanPath;
  }
  return `/${language}${cleanPath === "/" ? "" : cleanPath}`;
}
