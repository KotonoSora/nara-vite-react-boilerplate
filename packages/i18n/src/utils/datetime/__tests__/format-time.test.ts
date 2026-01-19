import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatTime } from "../format-time";

describe("formatTime", () => {
  const testDate = new Date("2025-10-24T14:30:00Z");

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
  ])("formats time from date object for language: %s", (lang) => {
    const result = formatTime(testDate, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([
    ["2025-10-24T14:30:00Z"],
    ["2025-01-01T00:00:00Z"],
    ["2025-12-31T23:59:59Z"],
    ["2025-06-15T12:00:00Z"],
  ])("formats time from string: %s", (timeString) => {
    const result = formatTime(timeString, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [testDate.getTime()],
    [Date.now()],
    [new Date("2025-01-01T12:00:00Z").getTime()],
  ])("formats time from timestamp: %s", (timestamp) => {
    const result = formatTime(timestamp, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats with 12-hour format", () => {
    const result = formatTime(testDate, "en" as SupportedLanguage, {
      hour12: true,
    });
    expect(result).toBeTruthy();
  });

  it("formats with 24-hour format", () => {
    const result = formatTime(testDate, "en" as SupportedLanguage, {
      hour12: false,
    });
    expect(result).toBeTruthy();
  });

  it("formats with seconds", () => {
    const result = formatTime(testDate, "en" as SupportedLanguage, {
      hour12: true,
      second: "2-digit",
    });
    expect(result).toBeTruthy();
  });

  it("formats with numeric hour and minute", () => {
    const result = formatTime(testDate, "en" as SupportedLanguage, {
      hour: "numeric",
      minute: "numeric",
    });
    expect(result).toBeTruthy();
  });

  it("formats with 2-digit hour and minute", () => {
    const result = formatTime(testDate, "en" as SupportedLanguage, {
      hour: "2-digit",
      minute: "2-digit",
    });
    expect(result).toBeTruthy();
  });

  it.each([
    ["en", { hour12: true, hour: "numeric", minute: "2-digit" }],
    ["fr", { hour12: false, hour: "2-digit", minute: "2-digit" }],
    ["ja", { hour: "numeric", minute: "numeric", second: "2-digit" }],
    ["es", { hour12: true, second: "2-digit" }],
  ])("formats with custom options for %s", (lang, options) => {
    const result = formatTime(
      testDate,
      lang as SupportedLanguage,
      options as any,
    );
    expect(result).toBeTruthy();
  });

  it("handles midnight", () => {
    const midnight = new Date("2025-10-24T00:00:00Z");
    const result = formatTime(midnight, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles noon", () => {
    const noon = new Date("2025-10-24T12:00:00Z");
    const result = formatTime(noon, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles edge case times", () => {
    const edgeTimes = [
      new Date("2025-10-24T00:00:00Z"),
      new Date("2025-10-24T23:59:59Z"),
      new Date("2025-10-24T12:00:00Z"),
    ];

    edgeTimes.forEach((time) => {
      const result = formatTime(time, "en" as SupportedLanguage);
      expect(result).toBeTruthy();
    });
  });
});
