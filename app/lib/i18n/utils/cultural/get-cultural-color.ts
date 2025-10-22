import type { SupportedLanguage } from "../../types/common";

import { CULTURAL_COLORS } from "../../constants/cultural";

/**
 * Returns the culturally appropriate color for a given semantic meaning and language.
 *
 * @param semantic - The semantic meaning for which to retrieve the color. Can be "primary", "success", "warning", or "danger".
 * @param language - The language code used to select the cultural color.
 * @returns The color string corresponding to the semantic meaning and language.
 */
export function getCulturalColor(
  semantic: "primary" | "success" | "warning" | "danger",
  language: SupportedLanguage,
): string {
  return CULTURAL_COLORS[language][semantic];
}
