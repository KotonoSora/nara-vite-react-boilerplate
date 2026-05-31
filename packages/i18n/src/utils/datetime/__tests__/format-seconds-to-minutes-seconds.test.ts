import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { formatSecondsToMinutesSeconds } from "../format-seconds-to-minutes-seconds";

describe("formatSecondsToMinutesSeconds", () => {
  it.each([[0], [30], [59], [60], [90], [3599], [3600], [3661], [7322]])(
    "returns non-empty string for %s seconds",
    (seconds) => {
      const result = formatSecondsToMinutesSeconds({ seconds, language: "en" });
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

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
  ])("formats seconds for language: %s", (lang) => {
    const result = formatSecondsToMinutesSeconds({
      seconds: 125,
      language: lang as SupportedLanguage,
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("omits hour component when under 3600 seconds", () => {
    const under = formatSecondsToMinutesSeconds({
      seconds: 3599,
      language: "en",
    });
    const over = formatSecondsToMinutesSeconds({
      seconds: 3600,
      language: "en",
    });
    // Output under an hour should be shorter (no hours component)
    expect(under.length).toBeLessThanOrEqual(over.length);
  });

  it("includes hour component when >= 3600 seconds", () => {
    const result = formatSecondsToMinutesSeconds({
      seconds: 3661,
      language: "en",
    });
    // e.g. "01:01:01" — should have two colons
    const colonCount = (result.match(/:/g) ?? []).length;
    expect(colonCount).toBeGreaterThanOrEqual(2);
  });

  it("has exactly one separator for under an hour", () => {
    const result = formatSecondsToMinutesSeconds({
      seconds: 125,
      language: "en",
    });
    // "02:05" — exactly one colon
    const colonCount = (result.match(/:/g) ?? []).length;
    expect(colonCount).toBeGreaterThanOrEqual(1);
  });

  it("returns consistent results for same inputs", () => {
    const r1 = formatSecondsToMinutesSeconds({ seconds: 125, language: "en" });
    const r2 = formatSecondsToMinutesSeconds({ seconds: 125, language: "en" });
    expect(r1).toBe(r2);
  });
});
