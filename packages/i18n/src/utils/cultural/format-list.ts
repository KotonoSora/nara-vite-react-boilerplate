import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { getIntlLocaleByLanguage } from "../datetime/get-intl-locale-by-language";

/**
 * Formats an array of strings into a localized list using conjunctions (e.g., "A, B, and C").
 *
 * @param items - The array of strings to format as a list.
 * @param language - The language to use for formatting, specified as a `SupportedLanguage`.
 * @param options - Optional `Intl.ListFormatOptions` to customize the formatting style and type.
 * @returns The formatted list as a string, localized according to the specified language and options.
 */
export function formatList(
  items: string[],
  language: SupportedLanguage,
  options?: Intl.ListFormatOptions,
): string {
  const locale = getIntlLocaleByLanguage(language);
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
    ...options,
  }).format(items);
}
