import type { SupportedLanguage } from "../types/common";

import { COMMON_PLURALS } from "../constants/pluralization";
import { pluralize } from "./pluralize";

/**
 * Returns the pluralized form of a given key based on the count and language.
 *
 * Looks up the pluralization rules for the specified language and key,
 * and returns the appropriate plural form. Optionally includes the count
 * in the returned string.
 *
 * @param key - The key representing the word to pluralize.
 * @param count - The number used to determine the plural form.
 * @param language - The language to use for pluralization.
 * @param includeCount - Whether to include the count in the returned string. Defaults to `true`.
 * @returns The pluralized string for the given key and count in the specified language.
 */
export function getCommonPlural(
  key: string,
  count: number,
  language: SupportedLanguage,
  includeCount: boolean = true,
): string {
  const pluralRules = COMMON_PLURALS[language];
  const forms = pluralRules[key];

  if (!forms) {
    console.warn(
      `No plural forms found for key: ${key} in language: ${language}`,
    );
    return `${count} ${key}`;
  }

  return pluralize(count, language, forms, includeCount);
}
