import type { SupportedLanguage } from "../../types/common";

import { CULTURAL_COLORS } from "../../constants/cultural";

/**
 * Check if a color is culturally appropriate
 */
export function isColorCulturallyAppropriate(
  color: string,
  language: SupportedLanguage,
  context: "general" | "celebration" | "mourning" = "general",
): { appropriate: boolean; reason?: string } {
  const colors = CULTURAL_COLORS[language];

  if (context === "mourning") {
    if (colors.inauspicious.includes(color.toUpperCase())) {
      return { appropriate: true };
    }
    if (colors.auspicious.includes(color.toUpperCase())) {
      return {
        appropriate: false,
        reason: "This color is associated with celebrations",
      };
    }
  }

  if (context === "celebration") {
    if (colors.auspicious.includes(color.toUpperCase())) {
      return { appropriate: true };
    }
    if (colors.inauspicious.includes(color.toUpperCase())) {
      return {
        appropriate: false,
        reason: "This color is considered inauspicious",
      };
    }
  }

  return { appropriate: true };
}
