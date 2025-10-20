import type { SupportedLanguage } from "../types/common";
import type { PluralCategory } from "../types/pluralization";

import { getPluralCategory } from "./get-plural-category";

// Get pluralized string based on count and language
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
