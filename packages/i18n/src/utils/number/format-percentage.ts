import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "../datetime/get-intl-locale-by-language";

/**
 * Formats a number as a percentage string according to the specified language and options.
 *
 * @param value - The numeric value to format as a percentage (e.g., 0.25 for 25%).
 * @param language - The language code used to determine the locale for formatting.
 * @param options - Optional `Intl.NumberFormatOptions` to customize the formatting.
 * @returns The formatted percentage string in the specified locale.
 */
export function formatPercentage(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = getIntlLocaleByLanguage(language);

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}
