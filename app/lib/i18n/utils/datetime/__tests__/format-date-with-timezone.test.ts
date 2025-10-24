import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { formatDateWithTimezone } from "../format-date-with-timezone";

describe("formatDateWithTimezone", () => {
  const testDate = new Date("2025-10-24T12:00:00Z");
  const timezones = [
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "UTC",
  ];

  it.each([
    ["en", "America/New_York"],
    ["fr", "Europe/Paris"],
    ["es", "Europe/Madrid"],
    ["ja", "Asia/Tokyo"],
    ["zh", "Asia/Shanghai"],
    ["vi", "Asia/Ho_Chi_Minh"],
    ["ar", "Asia/Dubai"],
  ])(
    "formats date with timezone for language: %s, timezone: %s",
    (lang, timezone) => {
      const result = formatDateWithTimezone(
        testDate,
        lang as SupportedLanguage,
        timezone,
      );
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it.each([
    ["2025-10-24T12:00:00Z"],
    ["2025-01-01T00:00:00Z"],
    ["2025-12-31T23:59:59Z"],
  ])("handles date as string: %s", (dateString) => {
    const result = formatDateWithTimezone(
      dateString,
      "en" as SupportedLanguage,
      "America/New_York",
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [testDate.getTime()],
    [Date.now()],
    [new Date("2025-01-01").getTime()],
  ])("handles date as timestamp: %s", (timestamp) => {
    const result = formatDateWithTimezone(
      timestamp,
      "en" as SupportedLanguage,
      "America/New_York",
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each(timezones)("handles different timezones: %s", (timezone) => {
    const result = formatDateWithTimezone(
      testDate,
      "en" as SupportedLanguage,
      timezone,
    );
    expect(result).toBeTruthy();
  });

  it("accepts custom options for month format", () => {
    const result = formatDateWithTimezone(
      testDate,
      "en" as SupportedLanguage,
      "America/New_York",
      { month: "short" },
    );
    expect(result).toBeTruthy();
  });

  it("accepts custom options for full date", () => {
    const result = formatDateWithTimezone(
      testDate,
      "en" as SupportedLanguage,
      "America/New_York",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
    expect(result).toBeTruthy();
  });

  it("handles date object input", () => {
    const result = formatDateWithTimezone(
      testDate,
      "en" as SupportedLanguage,
      "America/New_York",
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("handles edge case dates", () => {
    const edgeDates = [
      new Date("2000-01-01T00:00:00Z"), // Y2K
      new Date("2038-01-19T03:14:07Z"), // Unix timestamp edge
      new Date("1970-01-01T00:00:00Z"), // Unix epoch
    ];

    edgeDates.forEach((date) => {
      const result = formatDateWithTimezone(
        date,
        "en" as SupportedLanguage,
        "UTC",
      );
      expect(result).toBeTruthy();
    });
  });
});
