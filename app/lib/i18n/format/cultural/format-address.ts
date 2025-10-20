import type { SupportedLanguage } from "../../types/common";
import type { Address } from "../../types/cultural";

import { ADDRESS_FORMATS } from "../../constants/cultural";

/**
 * Formats an address object into a string according to cultural and language-specific conventions.
 *
 * The formatting adapts to the specified language, supporting both Western and Asian address formats.
 * It can output the address in a single line or multiline format, and optionally include the country.
 *
 * @param address - The address object containing fields such as name, street, city, state, postalCode, and country.
 * @param language - The language code used to determine the address format (e.g., "en", "zh", "ja").
 * @param options - Optional formatting options.
 * @param options.multiline - If true, formats the address in multiple lines. Defaults to false.
 * @param options.includeCountry - If true, includes the country in the formatted address. Defaults to true.
 * @returns The formatted address string.
 */
export function formatAddress(
  address: Address,
  language: SupportedLanguage,
  options: { multiline?: boolean; includeCountry?: boolean } = {},
): string {
  const format = ADDRESS_FORMATS[language];
  const { multiline = false, includeCountry = true } = options;

  const components: string[] = [];

  for (const component of format.order) {
    const value = address[component as keyof Address];
    if (value && (component !== "country" || includeCountry)) {
      components.push(value);
    }
  }

  if (multiline) {
    // Group components for multiline formatting
    const lines: string[] = [];
    if (address.name) lines.push(address.name);
    if (address.street) lines.push(address.street);

    const cityLine: string[] = [];
    if (language === "zh" || language === "ja") {
      // Asian format: postal code first
      if (address.postalCode) cityLine.push(address.postalCode);
      if (address.city) cityLine.push(address.city);
      if (address.state) cityLine.push(address.state);
    } else {
      // Western format: city, state postal code
      if (address.city) cityLine.push(address.city);
      if (address.state) cityLine.push(address.state);
      if (address.postalCode) cityLine.push(address.postalCode);
    }

    if (cityLine.length > 0) {
      lines.push(cityLine.join(format.separator));
    }

    if (address.country && includeCountry) {
      lines.push(address.country);
    }

    return lines.join(format.lineSeparator);
  }

  return components.join(format.separator);
}
