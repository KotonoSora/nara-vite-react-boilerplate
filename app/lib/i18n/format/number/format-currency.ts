import type { SupportedLanguage } from "../../types/common";

import { CURRENCY_MAP } from "../../constants/currency";
import { LOCALE_MAP } from "../../constants/locale";

// Currency formatting
export function formatCurrency(
  value: number,
  language: SupportedLanguage,
  currency?: string,
): string {
  const locale = LOCALE_MAP[language];
  const currencyCode = currency || CURRENCY_MAP[language];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}
