import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Returns a formatted month label for a given date and language.
 *
 * Uses the Intl.DateTimeFormat API to format the date as a short month and numeric year,
 * according to the specified language or a default locale if none is provided.
 *
 * @function formatMonthLabel
 * @param {Object} params - An object containing:
 * @param {Date} params.date - The date to format.
 * @param {SupportedLanguage|string} [params.language] - (Optional) The language code or SupportedLanguage to use for formatting.
 * @param {('numeric'|'2-digit'|'long'|'short'|'narrow'|undefined)} [params.formatStyle] - (Optional) The format style for the month.
 * @returns {string} The formatted month label as a string (e.g., "Jan 2024").
 */
export function formatMonthLabelByLanguage({
  date,
  language = "en",
  formatStyle = "long",
}: {
  date: Date;
  language?: SupportedLanguage | string;
  formatStyle?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
}): string {
  const locale = getIntlLocaleByLanguage(language);

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: formatStyle,
  });

  return formatter.format(date);
}
