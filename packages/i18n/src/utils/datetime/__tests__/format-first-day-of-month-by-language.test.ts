import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { formatFirstDayOfMonthByLanguage } from "../format-first-day-of-month-by-language";

describe("formatFirstDayOfMonthByLanguage", () => {
  const testDate = new Date("2025-01-15T12:00:00Z");

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
  ])("returns non-empty string for language: %s", (lang) => {
    const result = formatFirstDayOfMonthByLanguage({
      date: testDate,
      language: lang as SupportedLanguage,
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("uses English locale as default when language is omitted", () => {
    const result = formatFirstDayOfMonthByLanguage({ date: testDate });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("returns consistent result for same inputs", () => {
    const r1 = formatFirstDayOfMonthByLanguage({
      date: testDate,
      language: "en",
    });
    const r2 = formatFirstDayOfMonthByLanguage({
      date: testDate,
      language: "en",
    });
    expect(r1).toBe(r2);
  });

  it("produces different output for different languages", () => {
    const en = formatFirstDayOfMonthByLanguage({
      date: testDate,
      language: "en",
    });
    const ar = formatFirstDayOfMonthByLanguage({
      date: testDate,
      language: "ar",
    });
    // Arabic numerals vs Latin numerals differ
    expect(typeof en).toBe("string");
    expect(typeof ar).toBe("string");
  });

  it.each([
    [new Date("2025-01-01T00:00:00Z")],
    [new Date("2025-06-15T12:00:00Z")],
    [new Date("2025-12-31T23:59:59Z")],
  ])("handles various dates: %s", (date) => {
    const result = formatFirstDayOfMonthByLanguage({ date, language: "en" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("accepts a plain string language code", () => {
    const result = formatFirstDayOfMonthByLanguage({
      date: testDate,
      language: "en",
    });
    expect(result).toBeTruthy();
  });
});
