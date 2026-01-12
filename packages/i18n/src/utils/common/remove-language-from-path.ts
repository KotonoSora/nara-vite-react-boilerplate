import { isSupportedLanguage } from "./is-supported-language";

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
