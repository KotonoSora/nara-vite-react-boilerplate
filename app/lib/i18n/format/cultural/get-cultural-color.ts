import type { SupportedLanguage } from "../../types/common";

import { CULTURAL_COLORS } from "../../constants/cultural";

/**
 * Get cultural color for a semantic meaning
 */
export function getCulturalColor(
  semantic: "primary" | "success" | "warning" | "danger",
  language: SupportedLanguage,
): string {
  return CULTURAL_COLORS[language][semantic];
}
