import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { getWeekStartsOnByLanguage } from "../get-week-starts-on-by-language";

describe("getWeekStartsOnByLanguage", () => {
  it("returns 0 (Sunday) when startOnSunday is true", async () => {
    const result = await getWeekStartsOnByLanguage({
      startOnSunday: true,
      language: "en",
    });
    expect(result).toBe(0);
  });

  it("returns 1 (Monday) when startOnSunday is false", async () => {
    const result = await getWeekStartsOnByLanguage({
      startOnSunday: false,
      language: "en",
    });
    expect(result).toBe(1);
  });

  it("returns a valid Day value (0–6) when startOnSunday is undefined", async () => {
    const result = await getWeekStartsOnByLanguage({ language: "en" });
    expect([0, 1, 2, 3, 4, 5, 6]).toContain(result);
  });

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
  ])("returns a valid Day for language: %s without override", async (lang) => {
    const result = await getWeekStartsOnByLanguage({
      language: lang as SupportedLanguage,
    });
    expect([0, 1, 2, 3, 4, 5, 6]).toContain(result);
  });

  it("startOnSunday override takes precedence over locale default", async () => {
    const sunday = await getWeekStartsOnByLanguage({
      startOnSunday: true,
      language: "fr",
    });
    const monday = await getWeekStartsOnByLanguage({
      startOnSunday: false,
      language: "fr",
    });
    expect(sunday).toBe(0);
    expect(monday).toBe(1);
  });

  it("returns consistent results for same inputs", async () => {
    const r1 = await getWeekStartsOnByLanguage({ language: "en" });
    const r2 = await getWeekStartsOnByLanguage({ language: "en" });
    expect(r1).toBe(r2);
  });

  it("works without language parameter", async () => {
    const result = await getWeekStartsOnByLanguage({});
    expect([0, 1, 2, 3, 4, 5, 6]).toContain(result);
  });
});
