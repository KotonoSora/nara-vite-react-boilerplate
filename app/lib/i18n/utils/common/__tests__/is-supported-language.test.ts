import { describe, expect, it } from "vitest";

import { isSupportedLanguage } from "../is-supported-language";

describe("isSupportedLanguage", () => {
  it.each([
    ["en", true],
    ["fr", true],
    ["es", true],
    ["zh", true],
    ["hi", true],
    ["ar", true],
    ["vi", true],
    ["ja", true],
    ["th", true],
  ])("returns true for supported language: %s", (lang, expected) => {
    expect(isSupportedLanguage(lang)).toBe(expected);
  });

  it.each([
    ["xx", false],
    ["yy", false],
    ["zz", false],
    ["de", false],
    ["it", false],
    ["pt", false],
    ["ru", false],
    ["", false],
    ["EN", false],
    ["Fr", false],
    ["en-US", false],
    ["fr-FR", false],
  ])("returns false for unsupported language: %s", (lang, expected) => {
    expect(isSupportedLanguage(lang)).toBe(expected);
  });

  it("handles edge cases", () => {
    expect(isSupportedLanguage(null as any)).toBe(false);
    expect(isSupportedLanguage(undefined as any)).toBe(false);
    expect(isSupportedLanguage(123 as any)).toBe(false);
  });
});
