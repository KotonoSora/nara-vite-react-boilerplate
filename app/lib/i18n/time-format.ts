import type { TranslationFunction } from "./types";

/**
 * Formats a relative time string using i18n translations
 * @param t - Translation function
 * @param timeValue - Time value in minutes, hours, days, etc.
 * @param unit - The time unit ('minutes', 'hours', 'days', 'weeks', 'months', 'years')
 * @returns Formatted time string
 */
export function formatRelativeTime(
  t: TranslationFunction,
  timeValue: number,
  unit: "minutes" | "hours" | "days" | "weeks" | "months" | "years",
): string {
  if (timeValue === 0) {
    return (t as any)("time.now");
  }

  const timeKey = `time.${unit}Ago`;
  return (t as any)(timeKey, { count: timeValue });
}

/**
 * Calculates and formats relative time from a date
 * @param t - Translation function
 * @param date - The date to compare with current time
 * @returns Formatted relative time string
 */
export function formatTimeAgo(
  t: TranslationFunction,
  date: Date | string,
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
    return formatRelativeTime(t, years, "years");
  } else if (months > 0) {
    return formatRelativeTime(t, months, "months");
  } else if (weeks > 0) {
    return formatRelativeTime(t, weeks, "weeks");
  } else if (days > 0) {
    return formatRelativeTime(t, days, "days");
  } else if (hours > 0) {
    return formatRelativeTime(t, hours, "hours");
  } else if (minutes > 0) {
    return formatRelativeTime(t, minutes, "minutes");
  } else {
    return (t as any)("time.now");
  }
}
