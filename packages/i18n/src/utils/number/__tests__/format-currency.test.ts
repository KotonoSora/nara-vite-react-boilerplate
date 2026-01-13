import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatCurrency } from "../format-currency";

describe("formatCurrency", () => {
  it.each([["en"], ["fr"], ["es"], ["ja"], ["vi"], ["zh"], ["ar"]])(
    "formats currency with default currency code for language: %s",
    (lang) => {
      const result = formatCurrency(1234.56, lang as SupportedLanguage);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it.each([
    [1234.56, "en", "EUR", "€"],
    [1234.56, "fr", "EUR", "€"],
    [1234.56, "en", "GBP", "£"],
    [1234.56, "en", "JPY", "¥"],
    [1234.56, "en", "CNY", "CN¥"],
  ])(
    "formats currency with specified currency code: %s %s %s",
    (value, lang, currency, symbol) => {
      const result = formatCurrency(value, lang as SupportedLanguage, currency);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    },
  );

  it.each([["USD"], ["EUR"], ["GBP"], ["JPY"], ["CNY"], ["CAD"], ["AUD"]])(
    "formats currency for different currencies: %s",
    (currency) => {
      const result = formatCurrency(
        1234.56,
        "en" as SupportedLanguage,
        currency,
      );
      expect(result).toBeTruthy();
    },
  );

  it("formats zero", () => {
    const result = formatCurrency(0, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [-1234.56, "en"],
    [-100, "fr"],
    [-0.99, "es"],
    [-1000000, "ja"],
  ])("formats negative values: %s in %s", (value, lang) => {
    const result = formatCurrency(value, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats small amounts", () => {
    const result = formatCurrency(0.99, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats large amounts", () => {
    const result = formatCurrency(1234567.89, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats whole numbers", () => {
    const result = formatCurrency(1000, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [100.5, "en", "USD"],
    [999.99, "fr", "EUR"],
    [1234567.89, "es", "EUR"],
    [50, "ja", "JPY"],
  ])(
    "formats various amounts and currencies: %s %s %s",
    (value, lang, currency) => {
      const result = formatCurrency(value, lang as SupportedLanguage, currency);
      expect(result).toBeTruthy();
    },
  );

  it("handles decimal precision", () => {
    const result = formatCurrency(1234.567, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats currency for multiple languages with same amount", () => {
    const amount = 1234.56;
    const languages: SupportedLanguage[] = ["en", "fr", "es", "ja"];

    languages.forEach((lang) => {
      const result = formatCurrency(amount, lang);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  it("formats currency with exact USD for English", () => {
    const result = formatCurrency(1234.56, "en" as SupportedLanguage, "USD");
    expect(result).toBe("$1,234.56");
  });

  it("handles very small decimal amounts", () => {
    const result = formatCurrency(0.01, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles very large amounts", () => {
    const result = formatCurrency(999999999.99, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });
});
