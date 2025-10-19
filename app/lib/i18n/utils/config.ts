import type { SupportedLanguage } from "../types/common";

import {
  DEFAULT_LANGUAGE,
  RTL_LANGUAGES,
  SUPPORTED_LANGUAGES,
} from "../constants/common";

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

/**
 * Extracts and validates a language code from the first segment of a URL pathname.
 *
 * @param pathname - The URL pathname to parse for a language code (e.g., "/en/about" or "/fr/contact")
 * @returns The supported language code if found in the first path segment, or `null` if no valid language is detected
 *
 * @example
 * ```typescript
 * getLanguageFromPath("/en/about"); // returns "en"
 * getLanguageFromPath("/fr/contact"); // returns "fr"
 * getLanguageFromPath("/about"); // returns null
 * getLanguageFromPath("/invalid/page"); // returns null
 * ```
 */
export function getLanguageFromPath(
  pathname: string,
): SupportedLanguage | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isSupportedLanguage(firstSegment)) {
    return firstSegment;
  }

  return null;
}

/**
 * Removes the language code from the beginning of a pathname if it exists.
 *
 * @param pathname - The URL pathname to process
 * @returns The pathname with the language segment removed if it was present and supported,
 *          otherwise returns the original pathname
 *
 * @example
 * ```ts
 * removeLanguageFromPath("/en/about") // returns "/about"
 * removeLanguageFromPath("/about") // returns "/about"
 * ```
 */
export function removeLanguageFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isSupportedLanguage(firstSegment)) {
    const pathWithoutLang = "/" + segments.slice(1).join("/");
    return pathWithoutLang;
  }

  return pathname;
}

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

/**
 * Detects and returns a supported language from an HTTP Accept-Language header string.
 *
 * Parses the Accept-Language header, which may contain multiple language codes with quality values,
 * sorts them by preference (quality), and returns the first supported language found.
 *
 * @param acceptLanguage - The Accept-Language header string (e.g., "en-US,en;q=0.9,fr;q=0.8")
 * @returns The detected supported language code, or the default language if none is found or if the input is undefined
 *
 * @example
 * ```typescript
 * detectLanguageFromAcceptLanguage("en-US,fr;q=0.8") // Returns "en" if supported
 * detectLanguageFromAcceptLanguage(undefined) // Returns DEFAULT_LANGUAGE
 * ```
 */
export function detectLanguageFromAcceptLanguage(
  acceptLanguage?: string,
): SupportedLanguage {
  if (!acceptLanguage) {
    return DEFAULT_LANGUAGE;
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality = "1"] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(),
        quality: parseFloat(quality),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (isSupportedLanguage(code)) {
      return code;
    }
  }

  return DEFAULT_LANGUAGE;
}
