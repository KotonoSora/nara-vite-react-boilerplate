import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { getIntlLocaleByLanguage } from "./get-intl-locale-by-language";

/**
 * Formats seconds to a localized time string (HH:MM:SS or MM:SS) using Intl.DateTimeFormat.
 * This produces locale-appropriate digits and separators (for example, Arabic locales).
 *
 * @param seconds - Total seconds to format
 * @param language - Supported language code for locale
 * @returns Localized time string (e.g., "1:05:30" or "05:30")
 */
export function formatSecondsToMinutesSeconds({
  seconds,
  language,
}: {
  seconds: number;
  language: SupportedLanguage;
}): string {
  // Use the project helper to get the proper Intl locale string
  const locale = getIntlLocaleByLanguage(language);

  // Create a Date at UTC epoch + seconds so Intl formats the duration parts
  const date = new Date(seconds * 1000);

  // If duration is 1 hour or more, include hours in the formatted output.
  const includeHours = seconds >= 3600;

  const options: Intl.DateTimeFormatOptions = {
    hour: includeHours ? "2-digit" : undefined,
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  };

  // Format using Intl so digits and separators are localized.
  // For durations < 1 hour we deliberately omit the `hour` option so
  // the formatter returns `MM:SS` (or the locale equivalent) rather than `00:MM:SS`.
  return new Intl.DateTimeFormat(locale, options).format(date);
}
