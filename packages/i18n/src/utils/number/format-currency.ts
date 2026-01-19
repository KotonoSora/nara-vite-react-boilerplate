import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { CURRENCY_MAP } from "../../constants/currency";
import { getIntlLocaleByLanguage } from "../datetime/get-intl-locale-by-language";

/**
 * Formats a numeric value as a currency string according to the specified language and currency.
 *
 * @param value - The numeric value to format.
 * @param language - The language to use for formatting, corresponding to a supported locale.
 * @param currency - Optional. The currency code to use for formatting. If not provided, a default currency for the language will be used.
 * @returns The formatted currency string.
 */
export function formatCurrency(
  value: number,
  language: SupportedLanguage,
  currency?: string,
): string {
  const locale = getIntlLocaleByLanguage(language);

  const currencyCode = currency || CURRENCY_MAP[language];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}
