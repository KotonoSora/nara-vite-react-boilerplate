import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { PHONE_FORMATS } from "../../constants/cultural";

/**
 * Formats a phone number string according to the specified language's regional format.
 *
 * Removes all non-digit characters from the input and applies the appropriate formatting pattern.
 * Optionally includes the country code or formats the number in international style.
 *
 * @param phoneNumber - The phone number string to format.
 * @param language - The language code used to determine the regional phone format.
 * @param options - Optional settings for formatting.
 * @param options.includeCountryCode - If true, prepends the country code to the formatted number.
 * @param options.international - If true, formats the number in international style.
 * @returns The formatted phone number string, or the original input if no pattern matches.
 */
export function formatPhoneNumber(
  phoneNumber: string,
  language: SupportedLanguage,
  options: { includeCountryCode?: boolean; international?: boolean } = {},
): string {
  const format = PHONE_FORMATS[language];
  const { includeCountryCode = false, international = false } = options;

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // Apply regional formatting
  const match = digits.match(format.pattern);
  if (match) {
    let formatted = format.format.replace(
      /\$(\d+)/g,
      (_, group) => match[parseInt(group)],
    );

    if (includeCountryCode || international) {
      formatted = `${format.countryCode} ${formatted}`;
    }

    return formatted;
  }

  // Return original if no pattern match
  return phoneNumber;
}
