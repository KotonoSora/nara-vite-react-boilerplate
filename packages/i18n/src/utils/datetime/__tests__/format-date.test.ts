import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatDate } from "../format-date";

describe("formatDate", () => {
  const testDate = new Date("2025-10-24T12:00:00Z");

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
  ])("formats date object for language: %s", (lang) => {
    const result = formatDate(testDate, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([
    ["2025-10-24"],
    ["2025-01-01"],
    ["2025-12-31"],
    ["2025-10-24T12:00:00Z"],
    ["2025-06-15T08:30:00Z"],
  ])("formats date from string: %s", (dateString) => {
    const result = formatDate(dateString, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [testDate.getTime()],
    [Date.now()],
    [new Date("2025-01-01").getTime()],
    [0], // Unix epoch
  ])("formats date from timestamp: %s", (timestamp) => {
    const result = formatDate(timestamp, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats with short month option", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage, {
      month: "short",
      day: "numeric",
    });
    expect(result).toBeTruthy();
  });

  it("formats with long month option", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    expect(result).toBeTruthy();
  });

  it("formats with full weekday", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    expect(result).toBeTruthy();
  });

  it("formats with short weekday", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage, {
      weekday: "short",
    });
    expect(result).toBeTruthy();
  });

  it("formats with year only", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage, {
      year: "numeric",
    });
    expect(result).toBeTruthy();
  });

  it("formats with month and year", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage, {
      month: "long",
      year: "numeric",
    });
    expect(result).toBeTruthy();
  });

  it.each([
    ["en", { month: "short", day: "numeric", year: "numeric" }],
    ["fr", { weekday: "long", month: "long", day: "numeric" }],
    ["ja", { year: "numeric", month: "2-digit", day: "2-digit" }],
    ["zh", { month: "long", day: "numeric" }],
  ])("formats with custom options for %s", (lang, options) => {
    const result = formatDate(
      testDate,
      lang as SupportedLanguage,
      options as any,
    );
    expect(result).toBeTruthy();
  });

  it("handles edge case dates", () => {
    const edgeDates = [
      new Date("2000-01-01T00:00:00Z"),
      new Date("1970-01-01T00:00:00Z"),
      new Date("2038-01-19T03:14:07Z"),
    ];

    edgeDates.forEach((date) => {
      const result = formatDate(date, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    });
  });

  it("formats date with exact format for English", () => {
    const result = formatDate(testDate, "en" as SupportedLanguage);
    expect(result).toBe("October 24, 2025");
  });

  it("handles leap year dates", () => {
    const leapDay = new Date("2024-02-29T12:00:00Z");
    const result = formatDate(leapDay, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });
});
