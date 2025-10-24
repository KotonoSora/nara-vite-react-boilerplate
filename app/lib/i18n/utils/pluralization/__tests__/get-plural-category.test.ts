import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { getPluralCategory } from "../get-plural-category";

describe("getPluralCategory", () => {
  it.each([
    ["en"],
    ["fr"],
    ["es"],
    ["ja"],
    ["vi"],
    ["zh"],
    ["ar"],
    ["hi"],
    ["th"],
  ])("returns plural category for language: %s", (lang) => {
    expect(typeof getPluralCategory(1, lang as SupportedLanguage)).toBe(
      "string",
    );
    expect(typeof getPluralCategory(0, lang as SupportedLanguage)).toBe(
      "string",
    );
    expect(typeof getPluralCategory(2, lang as SupportedLanguage)).toBe(
      "string",
    );
    expect(typeof getPluralCategory(100, lang as SupportedLanguage)).toBe(
      "string",
    );
    expect(typeof getPluralCategory(-1, lang as SupportedLanguage)).toBe(
      "string",
    );
    expect(typeof getPluralCategory(1.5, lang as SupportedLanguage)).toBe(
      "string",
    );
  });

  it.each([[0], [1], [2], [5], [100], [-1], [1.5]])(
    "returns valid plural category for English: %s",
    (count) => {
      const result = getPluralCategory(count, "en" as SupportedLanguage);
      expect(
        ["zero", "one", "two", "few", "many", "other"].includes(result),
      ).toBe(true);
    },
  );

  it("returns plural category for all supported languages and edge cases", () => {
    const counts = [0, 1, 2, 5, 100, -1, 1.5];
    const langs: SupportedLanguage[] = [
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
    langs.forEach((lang) => {
      counts.forEach((count) => {
        const result = getPluralCategory(count, lang);
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
