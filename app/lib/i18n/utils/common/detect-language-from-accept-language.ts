import type { SupportedLanguage } from "../../types/common";

import { DEFAULT_LANGUAGE } from "../../constants/common";
import { isSupportedLanguage } from "./is-supported-language";

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
