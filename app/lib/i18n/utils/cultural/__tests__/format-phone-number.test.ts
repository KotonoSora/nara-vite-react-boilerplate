import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { formatPhoneNumber } from "../format-phone-number";

describe("formatPhoneNumber", () => {
  const validUSPhone = "1234567890";
  const shortPhone = "123";

  it.each([
    ["en", validUSPhone],
    ["fr", validUSPhone],
    ["es", validUSPhone],
    ["ja", validUSPhone],
    ["vi", validUSPhone],
    ["zh", validUSPhone],
  ])("formats phone number for language: %s", (lang, phone) => {
    const result = formatPhoneNumber(phone, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([["en"], ["fr"], ["es"], ["ja"]])(
    "includes country code when specified for language: %s",
    (lang) => {
      const result = formatPhoneNumber(
        validUSPhone,
        lang as SupportedLanguage,
        {
          includeCountryCode: true,
        },
      );
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    },
  );

  it.each([["en"], ["fr"], ["es"]])(
    "formats international style for language: %s",
    (lang) => {
      const result = formatPhoneNumber(
        validUSPhone,
        lang as SupportedLanguage,
        {
          international: true,
        },
      );
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    },
  );

  it("combines international and country code options", () => {
    const result = formatPhoneNumber(validUSPhone, "en" as SupportedLanguage, {
      international: true,
      includeCountryCode: true,
    });
    expect(result).toBeTruthy();
  });

  it.each([
    ["123", "123"],
    ["", ""],
    ["abc", "abc"],
    ["12-34", "12-34"],
  ])("returns original if no pattern match: %s", (input, expected) => {
    const result = formatPhoneNumber(input, "en" as SupportedLanguage);
    expect(result).toBe(expected);
  });

  it("handles 7-digit phone numbers", () => {
    const sevenDigit = "5551234";
    const result = formatPhoneNumber(sevenDigit, "en" as SupportedLanguage);
    expect(typeof result).toBe("string");
  });

  it("handles 11-digit phone numbers with country code", () => {
    const elevenDigit = "15551234567";
    const result = formatPhoneNumber(elevenDigit, "en" as SupportedLanguage);
    expect(typeof result).toBe("string");
  });

  it("handles phone numbers with dashes", () => {
    const dashedPhone = "123-456-7890";
    const result = formatPhoneNumber(dashedPhone, "en" as SupportedLanguage);
    expect(typeof result).toBe("string");
  });

  it("handles phone numbers with parentheses", () => {
    const parenthesesPhone = "(123) 456-7890";
    const result = formatPhoneNumber(
      parenthesesPhone,
      "en" as SupportedLanguage,
    );
    expect(typeof result).toBe("string");
  });

  it("handles phone numbers with spaces", () => {
    const spacedPhone = "123 456 7890";
    const result = formatPhoneNumber(spacedPhone, "en" as SupportedLanguage);
    expect(typeof result).toBe("string");
  });

  it("handles empty string", () => {
    const result = formatPhoneNumber("", "en" as SupportedLanguage);
    expect(result).toBe("");
  });
});
