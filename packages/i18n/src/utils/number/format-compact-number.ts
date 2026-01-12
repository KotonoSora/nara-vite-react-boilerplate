import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "../datetime/get-intl-locale-by-language";

/**
 * Formats a number using compact notation (e.g., 1K, 1M) according to the specified language.
 *
 * @param value - The number to format.
 * @param language - The language to use for formatting, as a member of `SupportedLanguage`.
 * @returns The formatted number as a string in compact notation.
 */
export function formatCompactNumber(
  value: number,
  language: SupportedLanguage,
): string {
  const locale = getIntlLocaleByLanguage(language);

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}
