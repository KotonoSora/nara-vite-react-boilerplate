import type { SupportedLanguage } from "../types/common";

import { COMMON_PLURALS } from "../constants/pluralization";
import { pluralize } from "./pluralize";

// Helper function to get common plural
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
