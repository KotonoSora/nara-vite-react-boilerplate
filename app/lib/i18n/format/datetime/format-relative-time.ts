import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

// Relative time formatting
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: SupportedLanguage,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    ...options,
  }).format(value, unit);
}
