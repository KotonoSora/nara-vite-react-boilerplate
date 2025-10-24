import type { SupportedLanguage } from "../../types/common";

import { formatRelativeTime } from "./format-relative-time";

/**
 * Returns a localized relative time string representing the difference between the given date and the current time.
 *
 * The function calculates the time difference between the provided `date` and now, and formats it in a human-readable
 * relative format (e.g., "5 minutes ago", "in 2 days") according to the specified language.
 *
 * @param date - The target date to compare with the current time. Can be a `Date` object, ISO string, or timestamp.
 * @param language - The language code used for localization.
 * @returns A localized string describing the relative time difference.
 */
export function getRelativeTimeString(
  date: Date | string | number,
  language: SupportedLanguage,
): string {
  const now = new Date();
  const targetDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  const diffInSeconds = Math.floor(
    (targetDate.getTime() - now.getTime()) / 1000,
  );

  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 60) {
    return formatRelativeTime(diffInSeconds, "second", language);
  } else if (absSeconds < 3600) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 60),
      "minute",
      language,
    );
  } else if (absSeconds < 86400) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 3600),
      "hour",
      language,
    );
  } else if (absSeconds < 2592000) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 86400),
      "day",
      language,
    );
  } else if (absSeconds < 31536000) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 2592000),
      "month",
      language,
    );
  } else {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 31536000),
      "year",
      language,
    );
  }
}
