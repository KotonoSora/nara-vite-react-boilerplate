/**
 * Formats a date string into a short localized date format.
 * @param dateString - The date string to format (e.g., "2024-01-15")
 * @param locale - The locale code for formatting (default: "en-US")
 * @returns The formatted date string in short format (e.g., "Jan 15, 2024"), or the original string if parsing fails
 * @example
 * formatDateShort("2024-01-15") // "Jan 15, 2024"
 * formatDateShort("2024-01-15", "fr-FR") // "15 janv. 2024"
 */
export function formatDateShort(
  dateString: string,
  locale: string = "en-US",
): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
