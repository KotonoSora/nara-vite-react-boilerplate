import type { SupportedLanguage } from "../../types/common";

import { isSupportedLanguage } from "./is-supported-language";

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
