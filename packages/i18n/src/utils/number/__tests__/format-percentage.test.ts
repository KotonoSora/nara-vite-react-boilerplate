import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatPercentage } from "../format-percentage";

describe("formatPercentage", () => {
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
  ])("formats percentage with default options for language: %s", (lang) => {
    const result = formatPercentage(0.25, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([
    [0.5678, { minimumFractionDigits: 2, maximumFractionDigits: 2 }],
    [0.5, { minimumFractionDigits: 3, maximumFractionDigits: 3 }],
    [0.123456, { minimumFractionDigits: 1, maximumFractionDigits: 4 }],
  ])("formats percentage with custom options: %s", (value, options) => {
    const result = formatPercentage(value, "en" as SupportedLanguage, options);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats zero as percentage", () => {
    const result = formatPercentage(0, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([[0.5], [0.75], [0.25], [0.99]])(
    "formats percentage less than 100%: %s",
    (value) => {
      const result = formatPercentage(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    },
  );

  it("formats 100% (value of 1)", () => {
    const result = formatPercentage(1, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([[1.5], [2], [10], [100]])(
    "formats percentage greater than 100%: %s",
    (value) => {
      const result = formatPercentage(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    },
  );

  it.each([[-0.25], [-0.5], [-1], [-2.5]])(
    "formats negative percentages: %s",
    (value) => {
      const result = formatPercentage(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    },
  );

  it("formats very small percentage", () => {
    const result = formatPercentage(0.0001, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats very large percentage", () => {
    const result = formatPercentage(1000, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [0.12345, "en", { maximumFractionDigits: 0 }],
    [0.5, "fr", { minimumFractionDigits: 2 }],
    [0.999, "es", { minimumFractionDigits: 1, maximumFractionDigits: 2 }],
  ])("formats with fraction digit options: %s %s", (value, lang, options) => {
    const result = formatPercentage(value, lang as SupportedLanguage, options);
    expect(result).toBeTruthy();
  });

  it.each([
    [0.25, "en"],
    [0.25, "fr"],
    [0.25, "es"],
    [0.25, "ja"],
    [0.25, "zh"],
  ])("formats same value across languages: %s in %s", (value, lang) => {
    const result = formatPercentage(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles decimal precision", () => {
    const result = formatPercentage(0.123456789, "en" as SupportedLanguage, {
      maximumFractionDigits: 2,
    });
    expect(result).toBeTruthy();
  });

  it("formats percentage with no decimal places", () => {
    const result = formatPercentage(0.5, "en" as SupportedLanguage, {
      maximumFractionDigits: 0,
    });
    expect(result).toBeTruthy();
  });

  it("formats edge case of 0.01 (1%)", () => {
    const result = formatPercentage(0.01, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([[0.333333], [0.666666], [0.142857]])(
    "formats repeating decimals: %s",
    (value) => {
      const result = formatPercentage(value, "en" as SupportedLanguage, {
        maximumFractionDigits: 2,
      });
      expect(result).toBeTruthy();
    },
  );

  it("formats with minimum significant digits", () => {
    const result = formatPercentage(0.1, "en" as SupportedLanguage, {
      minimumSignificantDigits: 3,
    });
    expect(result).toBeTruthy();
  });

  it("handles scientific notation inputs", () => {
    const result = formatPercentage(1.5e-3, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });
});
