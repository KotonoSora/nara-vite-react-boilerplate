import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

// Compact number formatting (1K, 1M, etc.)
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
