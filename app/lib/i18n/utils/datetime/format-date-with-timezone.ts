import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Formats a date with the specified language, timezone, and formatting options.
 *
 * @param date - The date to format. Can be a `Date` object, ISO string, or timestamp.
 * @param language - The language code to use for formatting (must be a key in `LOCALE_MAP`).
 * @param timezone - Optional. The IANA timezone string (e.g., "America/New_York") to use for formatting.
 * @param options - Optional. Additional `Intl.DateTimeFormatOptions` to customize the output.
 * @returns The formatted date string according to the specified locale and timezone.
 */
export function formatDateWithTimezone(
  date: Date | string | number,
  language: SupportedLanguage,
  timezone?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = getIntlLocaleByLanguage(language);

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
