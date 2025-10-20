import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

// Timezone-aware formatting
export function formatDateWithTimezone(
  date: Date | string | number,
  language: SupportedLanguage,
  timezone?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    timeZoneName: "short",
    ...options,
  }).format(dateObj);
}
