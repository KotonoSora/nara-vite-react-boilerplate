import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Formats a given date, string, or number as a localized time string.
 *
 * @param date - The date to format. Can be a `Date` object, ISO string, or timestamp.
 * @param language - The supported language code used to determine the locale.
 * @param options - Optional. Additional `Intl.DateTimeFormatOptions` to customize formatting.
 * @returns The formatted time string according to the specified locale and options.
 */
export function formatTime(
  date: Date | string | number,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = getIntlLocaleByLanguage(language);

  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
}
