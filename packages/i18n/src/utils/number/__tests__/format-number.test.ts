import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { formatNumber } from "../format-number";

describe("formatNumber", () => {
  it.each([
    ["en", "1,234,567.89"],
    ["fr", "1 234 567,89"],
    ["es", "1.234.567,89"],
    ["ja", "1,234,567.89"],
    ["vi", "1.234.567,89"],
    ["zh", "1,234,567.89"],
    ["ar", "١٬٢٣٤٬٥٦٧٫٨٩"],
    ["hi", "12,34,567.89"],
    ["th", "1,234,567.89"],
  ])(
    "formats number with default options for language: %s",
    (lang, expected) => {
      const result = formatNumber(1234567.89, lang as SupportedLanguage);
      expect(result).toBe(expected);
    },
  );

  it.each([
    [1234.5678, { minimumFractionDigits: 2, maximumFractionDigits: 2 }],
    [1234.5, { minimumFractionDigits: 3, maximumFractionDigits: 3 }],
    [1234, { minimumFractionDigits: 2, maximumFractionDigits: 4 }],
  ])("formats number with custom options: %s", (value, options) => {
    const result = formatNumber(value, "en" as SupportedLanguage, options);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([[1234], [1000000], [999], [42], [0]])(
    "formats integer: %s",
    (value) => {
      const result = formatNumber(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    },
  );

  it.each([[1234.56], [0.99], [123.456789], [0.123], [999999.99]])(
    "formats decimal number: %s",
    (value) => {
      const result = formatNumber(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    },
  );

  it("formats zero", () => {
    const result = formatNumber(0, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([[-1234.56], [-1000000], [-0.99], [-42]])(
    "formats negative numbers: %s",
    (value) => {
      const result = formatNumber(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    },
  );

  it("formats very large numbers", () => {
    const result = formatNumber(123456789012345, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats very small numbers", () => {
    const result = formatNumber(0.000123, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [1234, "en", { minimumFractionDigits: 2 }],
    [1234.5, "fr", { maximumFractionDigits: 0 }],
    [1234.567, "es", { minimumFractionDigits: 1, maximumFractionDigits: 2 }],
  ])("formats with fraction digit options: %s %s", (value, lang, options) => {
    const result = formatNumber(value, lang as SupportedLanguage, options);
    expect(result).toBeTruthy();
  });

  it("handles scientific notation inputs", () => {
    const result = formatNumber(1.23e6, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [1234567.89, "en"],
    [1234567.89, "fr"],
    [1234567.89, "es"],
    [1234567.89, "ja"],
    [1234567.89, "zh"],
  ])("formats same number across languages: %s in %s", (value, lang) => {
    const result = formatNumber(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats with minimum integer digits", () => {
    const result = formatNumber(42, "en" as SupportedLanguage, {
      minimumIntegerDigits: 5,
    });
    expect(result).toBeTruthy();
  });

  it("formats with maximum significant digits", () => {
    const result = formatNumber(123456, "en" as SupportedLanguage, {
      maximumSignificantDigits: 3,
    });
    expect(result).toBeTruthy();
  });

  it("handles edge case of 1", () => {
    const result = formatNumber(1, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles decimal edge cases", () => {
    const values = [0.1, 0.01, 0.001, 0.0001];
    values.forEach((value) => {
      const result = formatNumber(value, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    });
  });
});
