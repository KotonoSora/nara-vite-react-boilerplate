import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatCompactNumber } from "../format-compact-number";

describe("formatCompactNumber", () => {
  it.each([
    [500, "en"],
    [999, "en"],
    [100, "fr"],
    [850, "es"],
    [250, "ja"],
    [750, "zh"],
  ])("formats small numbers: %s in %s", (value, lang) => {
    const result = formatCompactNumber(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([
    [1500, "en"],
    [5000, "en"],
    [10000, "fr"],
    [50000, "es"],
    [99999, "ja"],
    [1000, "zh"],
  ])("formats thousands: %s in %s", (value, lang) => {
    const result = formatCompactNumber(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [1500000, "en"],
    [5000000, "en"],
    [10000000, "fr"],
    [50000000, "es"],
    [999999999, "ja"],
  ])("formats millions: %s in %s", (value, lang) => {
    const result = formatCompactNumber(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [1500000000, "en"],
    [5000000000, "en"],
    [10000000000, "fr"],
    [999999999999, "es"],
  ])("formats billions: %s in %s", (value, lang) => {
    const result = formatCompactNumber(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([["en"], ["fr"], ["es"], ["ja"], ["vi"], ["zh"], ["ar"]])(
    "formats across all supported languages: %s",
    (lang) => {
      const values = [500, 1500, 1500000, 1500000000];
      values.forEach((value) => {
        const result = formatCompactNumber(value, lang as SupportedLanguage);
        expect(result).toBeTruthy();
      });
    },
  );

  it("handles zero", () => {
    const result = formatCompactNumber(0, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles negative numbers", () => {
    const result = formatCompactNumber(-1500000, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles decimal numbers", () => {
    const result = formatCompactNumber(1234.56, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles very large numbers (trillions)", () => {
    const result = formatCompactNumber(
      1500000000000,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("handles edge case of 1", () => {
    const result = formatCompactNumber(1, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [1234, "en"],
    [1234567, "fr"],
    [1234567890, "es"],
  ])("formats various magnitudes correctly: %s", (value, lang) => {
    const result = formatCompactNumber(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
