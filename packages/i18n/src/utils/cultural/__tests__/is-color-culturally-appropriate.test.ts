import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { isColorCulturallyAppropriate } from "../is-color-culturally-appropriate";

describe("isColorCulturallyAppropriate", () => {
  const contexts = ["general", "mourning", "celebration", "wedding"] as const;
  const colors = [
    "BLUE",
    "BLACK",
    "WHITE",
    "RED",
    "GREEN",
    "YELLOW",
    "PURPLE",
  ] as const;

  it.each([
    ["BLUE", "en", "general"],
    ["GREEN", "en", "general"],
    ["YELLOW", "fr", "general"],
    ["PURPLE", "es", "general"],
  ])(
    "returns appropriate for general context: %s in %s",
    (color, lang, context) => {
      const result = isColorCulturallyAppropriate(
        color,
        lang as SupportedLanguage,
        context as any,
      );
      expect(result.appropriate).toBe(true);
    },
  );

  it.each([
    ["BLACK", "en"],
    ["BLACK", "fr"],
    ["BLACK", "es"],
    ["WHITE", "zh"],
    ["WHITE", "ja"],
  ])("checks appropriateness for mourning context: %s in %s", (color, lang) => {
    const result = isColorCulturallyAppropriate(
      color,
      lang as SupportedLanguage,
      "mourning",
    );
    expect(result).toHaveProperty("appropriate");
    expect(typeof result.appropriate).toBe("boolean");
  });

  it.each([
    ["RED", "zh"],
    ["RED", "ja"],
    ["RED", "vi"],
    ["GOLD", "zh"],
    ["YELLOW", "zh"],
  ])(
    "checks appropriateness for celebration context: %s in %s",
    (color, lang) => {
      const result = isColorCulturallyAppropriate(
        color,
        lang as SupportedLanguage,
        "celebration",
      );
      expect(result).toHaveProperty("appropriate");
      expect(typeof result.appropriate).toBe("boolean");
    },
  );

  it("provides reason when inappropriate", () => {
    const result = isColorCulturallyAppropriate(
      "WHITE",
      "zh" as SupportedLanguage,
      "celebration",
    );
    if (!result.appropriate) {
      expect(result.reason).toBeTruthy();
      expect(typeof result.reason).toBe("string");
    }
  });

  it.each([
    ["WHITE", "en", "wedding"],
    ["RED", "zh", "wedding"],
    ["RED", "vi", "celebration"],
  ])("handles wedding context: %s in %s", (color, lang, context) => {
    const result = isColorCulturallyAppropriate(
      color,
      lang as SupportedLanguage,
      context as any,
    );
    expect(result).toHaveProperty("appropriate");
  });

  it("returns result with appropriate property for all inputs", () => {
    colors.forEach((color) => {
      contexts.forEach((context) => {
        const result = isColorCulturallyAppropriate(
          color,
          "en" as SupportedLanguage,
          context as any,
        );
        expect(result).toHaveProperty("appropriate");
        expect(typeof result.appropriate).toBe("boolean");
      });
    });
  });

  it.each([
    ["BLACK", "en", "mourning"],
    ["WHITE", "zh", "mourning"],
    ["RED", "zh", "celebration"],
  ])("handles case sensitivity: %s", (color, lang, context) => {
    const upperResult = isColorCulturallyAppropriate(
      color.toUpperCase(),
      lang as SupportedLanguage,
      context as any,
    );
    const lowerResult = isColorCulturallyAppropriate(
      color.toLowerCase(),
      lang as SupportedLanguage,
      context as any,
    );
    expect(upperResult.appropriate).toBe(lowerResult.appropriate);
  });

  it("provides reason when color is inappropriate", () => {
    const results = [
      isColorCulturallyAppropriate(
        "WHITE",
        "zh" as SupportedLanguage,
        "celebration",
      ),
      isColorCulturallyAppropriate(
        "BLACK",
        "zh" as SupportedLanguage,
        "celebration",
      ),
    ];

    results.forEach((result) => {
      if (!result.appropriate) {
        expect(result.reason).toBeTruthy();
        expect(result.reason!.length).toBeGreaterThan(0);
      }
    });
  });

  it("handles unknown colors gracefully", () => {
    const result = isColorCulturallyAppropriate(
      "UNKNOWN_COLOR",
      "en" as SupportedLanguage,
      "general",
    );
    expect(result).toHaveProperty("appropriate");
    expect(typeof result.appropriate).toBe("boolean");
  });
});
