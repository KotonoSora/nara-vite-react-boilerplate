import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatList } from "../format-list";

describe("formatList", () => {
  const sampleItems = ["Apple", "Banana", "Cherry"];
  const twoItems = ["Apple", "Banana"];

  it.each([
    ["en", sampleItems],
    ["fr", sampleItems],
    ["es", sampleItems],
    ["ja", sampleItems],
    ["vi", sampleItems],
    ["zh", sampleItems],
    ["ar", sampleItems],
  ])("formats array into localized list for language: %s", (lang, items) => {
    const result = formatList(items, lang as SupportedLanguage);
    expect(result).toContain("Apple");
    expect(result).toContain("Banana");
    expect(result).toContain("Cherry");
    expect(typeof result).toBe("string");
  });

  it.each([["en"], ["fr"], ["es"], ["ja"], ["zh"]])(
    "handles empty array for language: %s",
    (lang) => {
      const result = formatList([], lang as SupportedLanguage);
      expect(result).toBe("");
    },
  );

  it.each([
    ["en", "Apple"],
    ["fr", "Pomme"],
    ["es", "Manzana"],
    ["ja", "りんご"],
  ])("handles single item for language: %s", (lang, item) => {
    const result = formatList([item], lang as SupportedLanguage);
    expect(result).toBe(item);
  });

  it.each([
    ["en", twoItems],
    ["fr", twoItems],
    ["es", twoItems],
    ["ja", twoItems],
  ])("handles two items for language: %s", (lang, items) => {
    const result = formatList(items, lang as SupportedLanguage);
    expect(result).toContain("Apple");
    expect(result).toContain("Banana");
  });

  it("handles conjunction type (default)", () => {
    const result = formatList(sampleItems, "en" as SupportedLanguage, {
      type: "conjunction",
    });
    expect(result).toBeTruthy();
    expect(result).toContain("Apple");
  });

  it("handles disjunction type (or)", () => {
    const items = ["Red", "Green", "Blue"];
    const result = formatList(items, "en" as SupportedLanguage, {
      type: "disjunction",
    });
    expect(result).toBeTruthy();
    expect(result).toContain("Red");
  });

  it("handles unit type", () => {
    const items = ["5 meters", "10 kilograms", "15 liters"];
    const result = formatList(items, "en" as SupportedLanguage, {
      type: "unit",
    });
    expect(result).toBeTruthy();
  });

  it("formats list with exact conjunction for English", () => {
    const result = formatList(
      ["Apple", "Banana", "Cherry"],
      "en" as SupportedLanguage,
    );
    expect(result).toBe("Apple, Banana, and Cherry");
  });

  it("formats list with exact conjunction for English", () => {
    const result = formatList(
      ["Apple", "Banana", "Cherry"],
      "en" as SupportedLanguage,
    );
    expect(result).toBe("Apple, Banana, and Cherry");
  });

  it("handles long lists", () => {
    const longList = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
    const result = formatList(longList, "en" as SupportedLanguage);
    expect(result).toContain("Item 1");
    expect(result).toContain("Item 10");
  });

  it("handles items with special characters", () => {
    const items = ["A & B", "C, D", "E; F"];
    const result = formatList(items, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
