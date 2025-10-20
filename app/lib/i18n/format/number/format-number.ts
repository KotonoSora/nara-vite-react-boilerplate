import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

// Number formatting
export function formatNumber(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.NumberFormat(locale, options).format(value);
}
