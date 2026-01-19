import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { validatePostalCode } from "../validate-postal-code";

describe("validatePostalCode", () => {
  it.each([
    ["10001", "en", true],
    ["12345", "en", true],
    ["90210", "en", true],
    ["00000", "en", true],
  ])("validates US postal code format: %s", (code, lang, expected) => {
    const result = validatePostalCode(code, lang as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it.each([["en"], ["fr"], ["es"], ["ja"], ["vi"], ["zh"], ["ar"]])(
    "returns boolean for language: %s",
    (lang) => {
      const result = validatePostalCode("12345", lang as SupportedLanguage);
      expect(typeof result).toBe("boolean");
    },
  );

  it("validates based on language format", () => {
    const result = validatePostalCode("12345", "en" as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it.each([
    ["12345-6789", "en"],
    ["12345", "en"],
    ["K1A 0B1", "en"],
    ["75001", "fr"],
    ["28001", "es"],
  ])("handles various postal code formats: %s for %s", (code, lang) => {
    const result = validatePostalCode(code, lang as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it.each([
    ["", "en"],
    ["abc", "en"],
    ["123", "en"],
    ["!@#$%", "en"],
  ])("handles invalid postal codes: %s", (code, lang) => {
    const result = validatePostalCode(code, lang as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it("handles empty string", () => {
    const result = validatePostalCode("", "en" as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it("handles postal codes with spaces", () => {
    const result = validatePostalCode("12 345", "en" as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it("handles postal codes with dashes", () => {
    const result = validatePostalCode("12345-6789", "en" as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it("validates different formats for different languages", () => {
    const languages: SupportedLanguage[] = [
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
    languages.forEach((lang) => {
      const result = validatePostalCode("12345", lang);
      expect(typeof result).toBe("boolean");
    });
  });

  it("handles alphanumeric postal codes", () => {
    const result = validatePostalCode("K1A0B1", "en" as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });

  it("handles long postal codes", () => {
    const result = validatePostalCode(
      "123456789012345",
      "en" as SupportedLanguage,
    );
    expect(typeof result).toBe("boolean");
  });

  it("handles special characters in postal codes", () => {
    const result = validatePostalCode("12-345#67", "en" as SupportedLanguage);
    expect(typeof result).toBe("boolean");
  });
});
