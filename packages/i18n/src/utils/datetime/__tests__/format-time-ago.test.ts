import { describe, expect, it, vi } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

import { formatTimeAgo } from "../format-time-ago";

describe("formatTimeAgo", () => {
  it.each([["en"], ["fr"], ["es"], ["ja"], ["vi"], ["zh"], ["ar"]])(
    "formats date as time ago string for language: %s",
    (lang) => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 2); // 2 hours ago
      const result = formatTimeAgo(pastDate, lang as SupportedLanguage);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it.each([
    [1000 * 60 * 30], // 30 minutes ago
    [1000 * 60 * 60], // 1 hour ago
    [1000 * 60 * 60 * 5], // 5 hours ago
    [1000 * 60 * 60 * 24], // 1 day ago
  ])("handles different time intervals: %s ms ago", (milliseconds) => {
    const pastDate = new Date(Date.now() - milliseconds);
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("handles date string input", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 30); // 30 minutes ago
    const result = formatTimeAgo(
      pastDate.toISOString(),
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("handles timestamp input", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 45); // 45 minutes ago
    const result = formatTimeAgo(
      pastDate.toISOString(),
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("formats seconds ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 30); // 30 seconds ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats minutes ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 15); // 15 minutes ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats hours ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 6); // 6 hours ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats days ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3); // 3 days ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats weeks ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14); // 2 weeks ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats months ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 45); // ~1.5 months ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("formats years ago", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 400); // ~1 year ago
    const result = formatTimeAgo(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles very recent dates (just now)", () => {
    const justNow = new Date(Date.now() - 1000); // 1 second ago
    const result = formatTimeAgo(justNow, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles edge case of current time", () => {
    const now = new Date();
    const result = formatTimeAgo(now, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [new Date(Date.now() - 1000 * 60), "en"],
    [new Date(Date.now() - 1000 * 60 * 60), "fr"],
    [new Date(Date.now() - 1000 * 60 * 60 * 24), "es"],
    [new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), "ja"],
  ])("formats correctly for different languages and times", (date, lang) => {
    const result = formatTimeAgo(date, lang as SupportedLanguage);
    expect(result).toBeTruthy();
  });
});
