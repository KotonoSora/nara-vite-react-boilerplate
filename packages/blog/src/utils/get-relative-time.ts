import { formatDate } from "./format-date";

/**
 * Converts a date string into a human-readable relative time format.
 *
 * For recent dates (less than a week old), returns a relative time string
 * (e.g., "5 minutes ago", "2 hours ago"). For older dates, falls back to
 * formatted date representation.
 *
 * @param dateString - The date string to convert (should be a valid date format)
 * @param locale - The locale for date formatting. Defaults to "en-US"
 * @returns A human-readable relative time string, or the original dateString if parsing fails
 *
 * @example
 * getRelativeTime("2024-01-15T10:30:00Z") // "2 hours ago"
 * getRelativeTime("2024-01-08T10:30:00Z") // "January 8, 2024"
 */
export function getRelativeTime(
  dateString: string,
  locale: string = "en-US",
): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateString, locale);
  } catch {
    return dateString;
  }
}
