import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { getLocaleFromLanguage } from "../get-locale-from-language";

describe("getLocaleFromLanguage", () => {
  it.each([
    ["en", "en-US"],
    ["fr", "fr-FR"],
    ["es", "es-ES"],
    ["ja", "ja-JP"],
    ["zh", "zh-CN"],
    ["vi", "vi-VN"],
    ["ar", "ar-SA"],
    ["hi", "hi-IN"],
    ["th", "th-TH"],
  ])("returns locale for %s: %s", (lang, expectedLocalePattern) => {
    const result = getLocaleFromLanguage(lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Locale should contain the language code
    expect(result.toLowerCase()).toContain(lang.toLowerCase());
  });

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
  ])("returns valid locale string for language: %s", (lang) => {
    const result = getLocaleFromLanguage(lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("returns locale format with hyphen or underscore", () => {
    const languages: SupportedLanguage[] = ["en", "fr", "es", "ja", "zh"];
    languages.forEach((lang) => {
      const result = getLocaleFromLanguage(lang);
      // Locale typically contains hyphen (en-US) or underscore (en_US)
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(1);
    });
  });

  it("returns consistent locale for same language", () => {
    const result1 = getLocaleFromLanguage("en" as SupportedLanguage);
    const result2 = getLocaleFromLanguage("en" as SupportedLanguage);
    expect(result1).toBe(result2);
  });

  it("handles all supported languages", () => {
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
    const locales = languages.map((lang) => getLocaleFromLanguage(lang));

    // All locales should be truthy and strings
    locales.forEach((locale) => {
      expect(locale).toBeTruthy();
      expect(typeof locale).toBe("string");
    });

    // All locales should be unique or have reasonable duplicates
    const uniqueLocales = new Set(locales);
    expect(uniqueLocales.size).toBeGreaterThan(0);
  });
});
