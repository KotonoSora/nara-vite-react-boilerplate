import type { SupportedLanguage } from "../types/common";
import type { PluralCategory } from "../types/pluralization";

// Get plural category for a number in a specific language
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
