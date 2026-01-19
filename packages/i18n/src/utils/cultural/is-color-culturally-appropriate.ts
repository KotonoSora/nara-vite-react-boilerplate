import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { CULTURAL_COLORS } from "../../constants/cultural";

/**
 * Determines if a given color is culturally appropriate for a specified language and context.
 *
 * @param color - The color to evaluate (case-insensitive).
 * @param language - The language/culture to consider for color appropriateness.
 * @param context - The context in which the color is used. Can be "general", "celebration", or "mourning". Defaults to "general".
 * @returns An object indicating whether the color is appropriate (`appropriate: boolean`), and optionally a `reason` string if inappropriate.
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
