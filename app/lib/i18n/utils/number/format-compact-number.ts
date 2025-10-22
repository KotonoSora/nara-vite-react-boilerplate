import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

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
  const locale = LOCALE_MAP[language];
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}
