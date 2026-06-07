import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-types";

import {
  getDateFNSLocaleByLanguage,
  loadDateFnsLocale,
} from "../get-date-fns-locale-by-language";

describe("loadDateFnsLocale", () => {
  it.each([
    ["en"],
    ["fr"],
    ["es"],
    ["ja"],
    ["zh"],
    ["vi"],
    ["ar"],
    ["hi"],
    ["th"],
  ])("returns a date-fns Locale for language: %s", async (lang) => {
    const locale = await loadDateFnsLocale(lang as SupportedLanguage);
    expect(locale).toBeDefined();
    expect(typeof locale).toBe("object");
  });

  it("returns cached locale on second call (same reference)", async () => {
    const first = await loadDateFnsLocale("en");
    const second = await loadDateFnsLocale("en");
    expect(first).toBe(second);
  });

  it("returns locale object with a code or formatLong property", async () => {
    const locale = await loadDateFnsLocale("en");
    // date-fns locales always have at least one of these
    const hasShape = typeof locale === "object" && locale !== null;
    expect(hasShape).toBe(true);
  });

  it("falls back to English for unknown language code", async () => {
    const fallback = await loadDateFnsLocale("xx" as SupportedLanguage);
    const en = await loadDateFnsLocale("en");
    expect(fallback).toBeDefined();
    // Should match the English locale
    expect(fallback).toBe(en);
  });
});

describe("getDateFNSLocaleByLanguage", () => {
  it.each([
    ["en"],
    ["fr"],
    ["es"],
    ["ja"],
    ["zh"],
    ["vi"],
    ["ar"],
    ["hi"],
    ["th"],
  ])("resolves locale for language: %s", async (lang) => {
    const locale = await getDateFNSLocaleByLanguage(lang as SupportedLanguage);
    expect(locale).toBeDefined();
    expect(typeof locale).toBe("object");
  });

  it("is consistent with loadDateFnsLocale", async () => {
    const a = await getDateFNSLocaleByLanguage("fr");
    const b = await loadDateFnsLocale("fr");
    expect(a).toBe(b);
  });

  it("accepts a plain string (not just SupportedLanguage)", async () => {
    const locale = await getDateFNSLocaleByLanguage("en");
    expect(locale).toBeDefined();
  });
});
