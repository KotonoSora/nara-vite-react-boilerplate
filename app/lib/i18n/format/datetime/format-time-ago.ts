import type { SupportedLanguage } from "../../types/common";

import { formatRelativeTime } from "./format-relative-time";

/**
 * Calculates and formats relative time from a date
 * @param date - The date to compare with current time
 * @param language - The language for formatting
 * @returns Formatted relative time string
 */
export function formatTimeAgo(
  date: Date | string,
  language: SupportedLanguage,
): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return formatRelativeTime(-years, "year", language);
  } else if (months > 0) {
    return formatRelativeTime(-months, "month", language);
  } else if (weeks > 0) {
    return formatRelativeTime(-weeks, "week", language);
  } else if (days > 0) {
    return formatRelativeTime(-days, "day", language);
  } else if (hours > 0) {
    return formatRelativeTime(-hours, "hour", language);
  } else if (minutes > 0) {
    return formatRelativeTime(-minutes, "minute", language);
  } else {
    return formatRelativeTime(0, "second", language);
  }
}
