import { describe, expect, it } from "vitest";

import { isRTLLanguage } from "../is-rtl-language";

describe("isRTLLanguage", () => {
  it.each([
    ["ar", true],
    ["en", false],
    ["fr", false],
    ["es", false],
    ["zh", false],
    ["ja", false],
    ["vi", false],
    ["hi", false],
    ["th", false],
  ])("returns %s for RTL check: %s", (lang, expected) => {
    expect(
      isRTLLanguage(lang as import("../../../types/common").SupportedLanguage),
    ).toBe(expected);
  });

  it("returns false for invalid language input (type assertion)", () => {
    expect(isRTLLanguage("xx" as any)).toBe(false);
    expect(isRTLLanguage("" as any)).toBe(false);
  });
});
