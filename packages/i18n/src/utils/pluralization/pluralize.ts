import type { SupportedLanguage } from "../../types/common";
import type { PluralCategory } from "../../types/pluralization";

import { getPluralCategory } from "./get-plural-category";

/**
 * Returns the pluralized form of a string based on the provided count and language.
 *
 * @param count - The numeric value used to determine the plural category.
 * @param language - The language code used for pluralization rules.
 * @param forms - An object mapping plural categories to their respective string forms.
 *                Must include the 'other' category as a fallback.
 *                The string forms can include the `{{count}}` placeholder for substitution.
 * @param includeCount - Whether to include the count in the returned string by replacing `{{count}}`.
 *                       Defaults to `true`.
 * @returns The pluralized string, with the count substituted if `includeCount` is `true`.
 */
export function pluralize(
  count: number,
  language: SupportedLanguage,
  forms: Partial<Record<PluralCategory, string>> & { other: string },
  includeCount: boolean = true,
): string {
  const category = getPluralCategory(count, language);
  const form = forms[category] || forms.other;

  if (includeCount) {
    return form.replace(/{{count}}/g, count.toString());
  }

  return form;
}
