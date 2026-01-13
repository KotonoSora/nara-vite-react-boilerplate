import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { createPluralFunction } from "../create-plural-function";

describe("createPluralFunction", () => {
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
  ])("creates a pluralization function for language: %s", (lang) => {
    const pluralFn = createPluralFunction(lang as SupportedLanguage);
    expect(typeof pluralFn).toBe("function");
    expect(typeof pluralFn("item", 1)).toBe("string");
    expect(typeof pluralFn("item", 2)).toBe("string");
    expect(typeof pluralFn("item", 0)).toBe("string");
    expect(typeof pluralFn("item", -1)).toBe("string");
    expect(typeof pluralFn("item", 1.5)).toBe("string");
  });

  it.each([
    [2, { one: "item", other: "items" }, false],
    [1, { one: "item", other: "items" }, false],
    [5, { one: "{{count}} item", other: "{{count}} items" }, true],
    [0, { one: "item", other: "items" }, true],
    [-1, { one: "item", other: "items" }, true],
    [1.5, { one: "item", other: "items" }, true],
  ])(
    "pluralizes with custom forms and count: %s",
    (count, forms, includeCount) => {
      const pluralFn = createPluralFunction("en" as SupportedLanguage);
      const result = pluralFn("item", count, forms, includeCount);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      if (includeCount) {
        if (count > 0 && Number.isInteger(count)) {
          expect(result).toContain(String(count));
        }
      } else {
        expect(result).not.toContain(String(count));
      }
    },
  );

  it("falls back to common plural rules for missing forms", () => {
    const pluralFn = createPluralFunction("en" as SupportedLanguage);
    expect(typeof pluralFn("item", 1, undefined)).toBe("string");
    expect(typeof pluralFn("item", 2, undefined)).toBe("string");
  });
});
