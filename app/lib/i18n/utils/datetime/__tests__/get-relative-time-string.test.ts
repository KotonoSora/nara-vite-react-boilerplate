import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { getRelativeTimeString } from "../get-relative-time-string";

describe("getRelativeTimeString", () => {
  it.each([["en"], ["fr"], ["es"], ["ja"], ["vi"], ["zh"], ["ar"]])(
    "formats future date for language: %s",
    (lang) => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 2); // 2 hours from now
      const result = getRelativeTimeString(
        futureDate,
        lang as SupportedLanguage,
      );
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it.each([
    [1000 * 60 * 30], // 30 minutes from now
    [1000 * 60 * 60], // 1 hour from now
    [1000 * 60 * 60 * 5], // 5 hours from now
    [1000 * 60 * 60 * 24], // 1 day from now
    [1000 * 60 * 60 * 24 * 7], // 1 week from now
  ])("formats future dates: %s ms from now", (milliseconds) => {
    const futureDate = new Date(Date.now() + milliseconds);
    const result = getRelativeTimeString(futureDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it.each([
    [1000 * 60 * 30], // 30 minutes ago
    [1000 * 60 * 60], // 1 hour ago
    [1000 * 60 * 60 * 5], // 5 hours ago
    [1000 * 60 * 60 * 24], // 1 day ago
    [1000 * 60 * 60 * 24 * 7], // 1 week ago
  ])("formats past dates: %s ms ago", (milliseconds) => {
    const pastDate = new Date(Date.now() - milliseconds);
    const result = getRelativeTimeString(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats past date", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 30); // 30 minutes ago
    const result = getRelativeTimeString(pastDate, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles date as string for future", () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day from now
    const result = getRelativeTimeString(
      futureDate.toISOString(),
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("handles date as string for past", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // 1 day ago
    const result = getRelativeTimeString(
      pastDate.toISOString(),
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("handles date as timestamp for future", () => {
    const futureTimestamp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 1 week from now
    const result = getRelativeTimeString(
      futureTimestamp,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("handles date as timestamp for past", () => {
    const pastTimestamp = Date.now() - 1000 * 60 * 60 * 24 * 7; // 1 week ago
    const result = getRelativeTimeString(
      pastTimestamp,
      "en" as SupportedLanguage,
    );
    expect(result).toBeTruthy();
  });

  it("handles very recent past (seconds ago)", () => {
    const recentPast = new Date(Date.now() - 1000 * 30); // 30 seconds ago
    const result = getRelativeTimeString(recentPast, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles near future (seconds from now)", () => {
    const nearFuture = new Date(Date.now() + 1000 * 30); // 30 seconds from now
    const result = getRelativeTimeString(nearFuture, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles current time", () => {
    const now = new Date();
    const result = getRelativeTimeString(now, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it.each([
    [new Date(Date.now() + 1000 * 60), "en"], // 1 minute from now
    [new Date(Date.now() - 1000 * 60 * 60), "fr"], // 1 hour ago
    [new Date(Date.now() + 1000 * 60 * 60 * 24), "es"], // 1 day from now
    [new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), "ja"], // 1 week ago
  ])("formats correctly for different languages and times", (date, lang) => {
    const result = getRelativeTimeString(date, lang as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles far future dates", () => {
    const farFuture = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365); // 1 year from now
    const result = getRelativeTimeString(farFuture, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });

  it("handles far past dates", () => {
    const farPast = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365); // 1 year ago
    const result = getRelativeTimeString(farPast, "en" as SupportedLanguage);
    expect(result).toBeTruthy();
  });
});
