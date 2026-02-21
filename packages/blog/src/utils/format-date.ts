/**
 * Formats a date string into a localized date representation.
 * @param dateString - The date string to format (should be a valid date string)
 * @param locale - The locale code for formatting (default: "en-US")
 * @returns A formatted date string in the specified locale, or the original string if formatting fails
 * @example
 * formatDate("2024-01-15") // "January 15, 2024"
 * formatDate("2024-01-15", "fr-FR") // "15 janvier 2024"
 */
export function formatDate(
  dateString: string,
  locale: string = "en-US",
): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
