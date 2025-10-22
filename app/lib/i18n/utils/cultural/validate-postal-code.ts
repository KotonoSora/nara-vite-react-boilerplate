import type { SupportedLanguage } from "../../types/common";

import { ADDRESS_FORMATS } from "../../constants/cultural";

/**
 * Validates a postal code string against the format specified for a given language.
 *
 * @param postalCode - The postal code to validate.
 * @param language - The language used to determine the postal code format.
 * @returns `true` if the postal code matches the format for the specified language, or if no format is defined; otherwise, `false`.
 */
export function validatePostalCode(
  postalCode: string,
  language: SupportedLanguage,
): boolean {
  const format = ADDRESS_FORMATS[language];
  if (!format.postalCodeFormat) return true; // No validation pattern

  return format.postalCodeFormat.test(postalCode);
}
