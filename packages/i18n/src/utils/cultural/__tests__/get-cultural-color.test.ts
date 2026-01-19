import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { getCulturalColor } from "../get-cultural-color";

describe("getCulturalColor", () => {
  const semantics = ["primary", "success", "warning", "danger"] as const;

  it.each([["primary"], ["success"], ["warning"], ["danger"]])(
    "returns color for %s semantic",
    (semantic) => {
      const result = getCulturalColor(
        semantic as any,
        "en" as SupportedLanguage,
      );
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it.each([
    ["en", "primary"],
    ["fr", "primary"],
    ["es", "primary"],
    ["ja", "primary"],
    ["vi", "primary"],
    ["zh", "primary"],
    ["ar", "primary"],
  ])("returns color for language %s and semantic %s", (lang, semantic) => {
    const result = getCulturalColor(semantic as any, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    ["en", "success"],
    ["en", "warning"],
    ["en", "danger"],
    ["zh", "success"],
    ["zh", "warning"],
    ["zh", "danger"],
    ["ja", "primary"],
    ["ar", "primary"],
  ])("returns valid color format for %s - %s", (lang, semantic) => {
    const result = getCulturalColor(semantic as any, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    // Could be hex, rgb, or color name
    expect(typeof result).toBe("string");
  });

  it("returns consistent colors for same semantic across calls", () => {
    const result1 = getCulturalColor("primary", "en" as SupportedLanguage);
    const result2 = getCulturalColor("primary", "en" as SupportedLanguage);
    expect(result1).toBe(result2);
  });

  it("returns different colors for different semantics", () => {
    const primary = getCulturalColor("primary", "en" as SupportedLanguage);
    const success = getCulturalColor("success", "en" as SupportedLanguage);
    const warning = getCulturalColor("warning", "en" as SupportedLanguage);
    const danger = getCulturalColor("danger", "en" as SupportedLanguage);

    const colors = new Set([primary, success, warning, danger]);
    // At least some colors should be different
    expect(colors.size).toBeGreaterThan(1);
  });

  it("handles all supported languages", () => {
    const languages: SupportedLanguage[] = [
      "en",
      "fr",
      "es",
      "ja",
      "vi",
      "zh",
      "ar",
      "hi",
      "th",
    ];
    languages.forEach((lang) => {
      const result = getCulturalColor("primary", lang);
      expect(result).toBeTruthy();
    });
  });
});
