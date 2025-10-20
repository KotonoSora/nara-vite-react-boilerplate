import type { SupportedLanguage } from "../types/common";
import type { PluralCategory } from "../types/pluralization";

import { getCommonPlural } from "./get-common-plural";
import { pluralize } from "./pluralize";

/**
 * Creates a pluralization function for the specified language.
 *
 * The returned function generates the correct plural form for a given key and count,
 * optionally using custom plural forms. If custom forms are provided, it uses them;
 * otherwise, it falls back to common pluralization rules.
 *
 * @param language - The language to use for pluralization.
 * @returns A function that takes a key, count, optional custom forms, and an optional flag to include the count,
 *          and returns the appropriate pluralized string.
 *
 * @example
 * const pluralFn = createPluralFunction('en');
 * pluralFn('item', 2); // "2 items"
 * pluralFn('item', 1, { one: 'item', other: 'items' }); // "item"
 */
export function createPluralFunction(language: SupportedLanguage) {
  return (
    key: string,
    count: number,
    customForms?: Partial<Record<PluralCategory, string>> & { other: string },
    includeCount: boolean = true,
  ) => {
    if (customForms) {
      return pluralize(count, language, customForms, includeCount);
    }
    return getCommonPlural(key, count, language, includeCount);
  };
}
