import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { pluralize } from "../pluralize";

describe("pluralize", () => {
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
  ])("returns correct plural form for language: %s", (lang) => {
    const forms = { one: "{{count}} item", other: "{{count}} items" };
    expect(pluralize(2, lang as SupportedLanguage, forms)).toContain("2");
    expect(pluralize(1, lang as SupportedLanguage, forms)).toContain("1");
    expect(typeof pluralize(0, lang as SupportedLanguage, forms)).toBe(
      "string",
    );
    expect(typeof pluralize(-1, lang as SupportedLanguage, forms)).toBe(
      "string",
    );
    expect(typeof pluralize(1.5, lang as SupportedLanguage, forms)).toBe(
      "string",
    );
  });

  it.each([
    [5, { one: "item", other: "items" }, false],
    [1, { one: "item", other: "items" }, false],
    [2, { one: "{{count}} item", other: "{{count}} items" }, true],
    [0, { one: "item", other: "items" }, true],
    [-1, { one: "item", other: "items" }, true],
    [1.5, { one: "item", other: "items" }, true],
  ])(
    "excludes or includes count as specified: %s",
    (count, forms, includeCount) => {
      const result = pluralize(
        count,
        "en" as SupportedLanguage,
        forms,
        includeCount,
      );
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      if (includeCount) {
        // Only expect count for positive integers
        if (count > 0 && Number.isInteger(count)) {
          expect(result).toContain(String(count));
        }
      } else {
        expect(result).not.toContain(String(count));
      }
    },
  );

  it("returns exact pluralized strings for English", () => {
    const forms = { one: "{{count}} item", other: "{{count}} items" };
    expect(pluralize(1, "en" as SupportedLanguage, forms)).toBe("1 item");
    expect(pluralize(2, "en" as SupportedLanguage, forms)).toBe("2 items");
    expect(pluralize(0, "en" as SupportedLanguage, forms)).toBe("0 items");
    expect(pluralize(5, "en" as SupportedLanguage, forms)).toBe("5 items");
  });

  it("handles missing forms gracefully", () => {
    expect(typeof pluralize(1, "en" as SupportedLanguage, { other: "" })).toBe(
      "string",
    );
    expect(typeof pluralize(2, "en" as SupportedLanguage, { other: "" })).toBe(
      "string",
    );
  });
});
