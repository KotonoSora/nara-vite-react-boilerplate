import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "../datetime/get-intl-locale-by-language";

/**
 * Formats a number according to the specified language and formatting options.
 *
 * @param value - The number to format.
 * @param language - The language to use for formatting, as a key in `LOCALE_MAP`.
 * @param options - Optional `Intl.NumberFormatOptions` to customize the formatting.
 * @returns The formatted number as a string.
 */
export function formatNumber(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = getIntlLocaleByLanguage(language);

  return new Intl.NumberFormat(locale, options).format(value);
}
