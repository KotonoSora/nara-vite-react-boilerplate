import { addDays, format, startOfWeek } from "date-fns";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { getDateFNSLocaleByLanguage } from "./get-date-fns-locale-by-language";
import { getWeekStartsOnByLanguage } from "./get-week-starts-on-by-language";

/**
 * Get array of 7 weekday names with locale support and optional Sunday override
 * Fully SSR-safe (no browser APIs). Uses locale's default week start if startOnSunday is omitted.
 *
 * @function getWeekDayLabels
 * @param {Object} options - Options object
 * @param {SupportedLanguage|string} [options.language] - Language code for locale (e.g., 'en', 'es')
 * @param {boolean} [options.startOnSunday] - Override to start week on Sunday (true) or Monday (false)
 * @param {('long'|'short'|'narrow')} options.formatStyle - Format style for weekday names
 * @returns Array of 7 weekday names in correct order
 */
export async function getWeekDayLabels({
  language = "en",
  startOnSunday,
  formatStyle = "short",
}: {
  language?: SupportedLanguage | string;
  startOnSunday?: boolean;
  formatStyle?: "long" | "short" | "narrow";
}): Promise<string[]> {
  const locale = await getDateFNSLocaleByLanguage(language);

  // Determine weekStartsOn: prioritize override, then locale default, then Monday (1)
  const weekStartsOn = await getWeekStartsOnByLanguage({
    startOnSunday,
    language,
  });

  // Create a reference date in the desired week start
  let referenceDate = new Date(); // Current date (SSR-safe)
  const options = { locale, weekStartsOn };

  referenceDate = startOfWeek(referenceDate, options);

  const pattern =
    formatStyle === "short"
      ? "EEE"
      : formatStyle === "narrow"
        ? "EEEEE"
        : "EEEE";

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(referenceDate, i);
    return format(date, pattern, { locale });
  });
}
