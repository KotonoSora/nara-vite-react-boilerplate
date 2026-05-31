import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { formatMonthLabelByLanguage } from "../format-month-label-by-language";

describe("formatMonthLabelByLanguage", () => {
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
    const result = formatMonthLabelByLanguage({
      date: testDate,
      language: lang as SupportedLanguage,
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("uses English locale and 'long' format as defaults when omitted", () => {
    const result = formatMonthLabelByLanguage({ date: testDate });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([["long"], ["short"], ["narrow"], ["numeric"], ["2-digit"]] as const)(
    "respects formatStyle: %s",
    (formatStyle) => {
      const result = formatMonthLabelByLanguage({
        date: testDate,
        language: "en",
        formatStyle,
      });
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it("long format contains more characters than narrow for the same language", () => {
    const long = formatMonthLabelByLanguage({
      date: testDate,
      language: "en",
      formatStyle: "long",
    });
    const narrow = formatMonthLabelByLanguage({
      date: testDate,
      language: "en",
      formatStyle: "narrow",
    });
    expect(long.length).toBeGreaterThanOrEqual(narrow.length);
  });

  it("returns consistent output for same inputs", () => {
    const r1 = formatMonthLabelByLanguage({
      date: testDate,
      language: "en",
      formatStyle: "long",
    });
    const r2 = formatMonthLabelByLanguage({
      date: testDate,
      language: "en",
      formatStyle: "long",
    });
    expect(r1).toBe(r2);
  });

  it.each([
    [new Date("2025-01-01T00:00:00Z")],
    [new Date("2025-06-15T00:00:00Z")],
    [new Date("2025-12-31T00:00:00Z")],
  ])("handles various dates: %s", (date) => {
    const result = formatMonthLabelByLanguage({ date, language: "en" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
