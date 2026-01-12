import type { SupportedLanguage } from "../../types/common";

import { NAME_FORMATS } from "../../constants/cultural";

/**
 * Formats a person's name according to cultural conventions and language-specific rules.
 *
 * The function assembles name components (such as first, middle, last, etc.) in the order
 * specified by the language's format, optionally including an honorific and handling formal
 * name formatting (e.g., using initials for middle names in Western cultures).
 *
 * @param name - An object containing possible name components (first, middle, last, father, grandfather, family, maternal).
 * @param language - The language code used to determine the name formatting rules.
 * @param options - Optional settings:
 *   - honorific: An honorific to prepend if supported by the language.
 *   - formal: If true, applies formal formatting (e.g., initials for middle names in some languages).
 * @returns The formatted name string according to the specified language and options.
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
