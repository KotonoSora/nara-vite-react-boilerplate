import type { SupportedLanguage } from "../../types/common";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Formats a relative time value (e.g., "3 days ago", "in 2 hours") according to the specified language and options.
 *
 * @param value - The numeric value representing the amount of time to be formatted.
 * @param unit - The unit of time (e.g., "second", "minute", "hour", "day", "week", "month", "year").
 * @param language - The language to use for formatting, as defined in `SupportedLanguage`.
 * @param options - Optional formatting options for `Intl.RelativeTimeFormat`.
 * @returns A localized string representing the relative time.
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: SupportedLanguage,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  const locale = getIntlLocaleByLanguage(language);

  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    ...options,
  }).format(value, unit);
}
