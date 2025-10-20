import type { SupportedLanguage } from "../types/common";
import type { PluralCategory } from "../types/pluralization";

import { getCommonPlural } from "./get-common-plural";
import { pluralize } from "./pluralize";

// Create a pluralization function for a specific language
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
