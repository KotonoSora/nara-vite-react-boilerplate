import type { SupportedLanguage } from "../../types/common";
import type { PluralCategory } from "../../types/pluralization";

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
  const localeMap: Record<SupportedLanguage, string> = {
    en: "en",
    es: "es",
    fr: "fr",
    zh: "zh",
    hi: "hi",
    ar: "ar",
    vi: "vi",
    ja: "ja",
    th: "th",
  };

  const locale = localeMap[language];
  const pr = new Intl.PluralRules(locale);
  return pr.select(count) as PluralCategory;
}
