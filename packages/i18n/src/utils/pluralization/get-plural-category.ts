import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import type { PluralCategory } from "../../types/pluralization";

import { getIntlLocaleByLanguage } from "../datetime/get-intl-locale-by-language";

/**
 * Returns the plural category for a given count and language.
 *
 * Uses the `Intl.PluralRules` API to determine the pluralization category
 * (such as 'one', 'few', 'many', 'other') for the specified language and count.
 *
 * @param count - The number to determine the plural category for.
 * @param language - The language code to use for pluralization rules.
 * @returns The plural category as defined by the language's pluralization rules.
 */
export function getPluralCategory(
  count: number,
  language: SupportedLanguage,
): PluralCategory {
  const locale = getIntlLocaleByLanguage(language);
  const pr = new Intl.PluralRules(locale);
  return pr.select(count) as PluralCategory;
}
