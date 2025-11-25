import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Formats a given date into a localized string representation.
 *
 * @param date - The date to format. Can be a `Date` object, a string, or a number.
 * @param language - The language code used to determine the locale for formatting.
 * @param options - Optional. Additional formatting options for `Intl.DateTimeFormat`.
 * @returns The formatted date string according to the specified locale and options.
 */
export function formatDate(
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
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj);
}
