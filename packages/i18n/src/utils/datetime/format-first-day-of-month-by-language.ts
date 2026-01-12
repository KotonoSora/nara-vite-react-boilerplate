import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Formats the first day of a given month according to the specified language.
 *
 * Uses the `Intl.DateTimeFormat` API to format the date with numeric month and day,
 * based on the locale derived from the provided language.
 *
 * @function formatFirstDayOfMonthByLanguage
 * @param {Object} params - An object containing:
 * @param {Date} params.date - The date to format.
 * @param {SupportedLanguage|string} [params.language] - (Optional) The language code or SupportedLanguage to use for formatting.
 * @returns {string} The formatted first day of the month as a string (e.g., "1/1" for January 1st).
 */
export function formatFirstDayOfMonthByLanguage({
  date,
  language = "en",
}: {
  date: Date;
  language?: SupportedLanguage | string;
}): string {
  const locale = getIntlLocaleByLanguage(language);

  const formatter = new Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(date);
}
