import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

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
  const locale = LOCALE_MAP[language];
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
    ...options,
  }).format(items);
}
