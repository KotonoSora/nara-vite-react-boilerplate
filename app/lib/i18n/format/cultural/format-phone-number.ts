import type { SupportedLanguage } from "../../types/common";

import { PHONE_FORMATS } from "../../constants/cultural";

/**
 * Format phone number according to cultural conventions
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
