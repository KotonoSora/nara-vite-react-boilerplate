import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatRelativeTime } from "../format-relative-time";

describe("formatRelativeTime", () => {
  const units = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ] as const;

  it.each([
    [-3, "day", "en"],
    [-1, "day", "fr"],
    [-7, "day", "es"],
    [-30, "day", "ja"],
    [5, "day", "zh"],
  ])("formats relative time: %s %s in %s", (value, unit, lang) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      lang as SupportedLanguage,
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([
    [2, "hour"],
    [-5, "hour"],
    [12, "hour"],
    [-24, "hour"],
  ])("formats relative time in hours: %s", (value, unit) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [-30, "minute"],
    [15, "minute"],
    [-60, "minute"],
    [90, "minute"],
  ])("formats relative time in minutes: %s", (value, unit) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [-10, "second"],
    [30, "second"],
    [-45, "second"],
    [60, "second"],
  ])("formats relative time in seconds: %s", (value, unit) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it.each([
    [-1, "week"],
    [2, "week"],
    [-4, "week"],
  ])("formats relative time in weeks: %s", (value, unit) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it.each([
    [-1, "month"],
    [3, "month"],
    [-6, "month"],
    [12, "month"],
  ])("formats relative time in months: %s", (value, unit) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it.each([
    [-1, "year"],
    [2, "year"],
    [-5, "year"],
  ])("formats relative time in years: %s", (value, unit) => {
    const result = formatRelativeTime(
      value,
      unit as any,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("formats with numeric always option", () => {
    const result = formatRelativeTime(-1, "day", "en" as SupportedLanguage, {
      numeric: "always",
    });
    expect(result).toBeTruthy();
  });

  it("formats with numeric auto option", () => {
    const result = formatRelativeTime(-1, "day", "en" as SupportedLanguage, {
      numeric: "auto",
    });
    expect(result).toBeTruthy();
  });

  it.each([
    ["en", { numeric: "always" as const }],
    ["fr", { numeric: "auto" as const }],
    ["es", { style: "long" as const }],
    ["ja", { style: "short" as const }],
  ])("formats with custom options for %s", (lang, options) => {
    const result = formatRelativeTime(
      -1,
      "day",
      lang as SupportedLanguage,
      options,
    );
    expect(result).toBeTruthy();
  });

  it("handles zero value", () => {
    const result = formatRelativeTime(0, "day", "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([["en"], ["fr"], ["es"], ["ja"], ["zh"], ["vi"], ["ar"]])(
    "formats for all supported languages: %s",
    (lang) => {
      const result = formatRelativeTime(-3, "day", lang as SupportedLanguage);
      expect(result).toBeTruthy();
    },
  );
});
