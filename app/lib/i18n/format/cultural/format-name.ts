import type { SupportedLanguage } from "../../types/common";

import { NAME_FORMATS } from "../../constants/cultural";

/**
 * Format name according to cultural conventions
 */
export function formatName(
  name: {
    first?: string;
    middle?: string;
    last?: string;
    father?: string;
    grandfather?: string;
    family?: string;
    maternal?: string;
  },
  language: SupportedLanguage,
  options: { honorific?: string; formal?: boolean } = {},
): string {
  const format = NAME_FORMATS[language];
  const { honorific, formal = false } = options;

  const components: string[] = [];

  if (honorific && format.honorifics.includes(honorific)) {
    components.push(honorific);
  }

  for (const component of format.order) {
    const value = name[component as keyof typeof name];
    if (value) {
      // For formal names, only use initials for middle names in Western cultures
      if (
        formal &&
        component === "middle" &&
        (language === "en" || language === "es" || language === "fr")
      ) {
        components.push(value.charAt(0) + ".");
      } else {
        components.push(value);
      }
    }
  }

  return components.join(format.separator);
}
