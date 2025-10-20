import type { SupportedLanguage } from "../../types/common";

import { ADDRESS_FORMATS } from "../../constants/cultural";

/**
 * Validate postal code format for a language
 */
export function validatePostalCode(
  postalCode: string,
  language: SupportedLanguage,
): boolean {
  const format = ADDRESS_FORMATS[language];
  if (!format.postalCodeFormat) return true; // No validation pattern

  return format.postalCodeFormat.test(postalCode);
}
