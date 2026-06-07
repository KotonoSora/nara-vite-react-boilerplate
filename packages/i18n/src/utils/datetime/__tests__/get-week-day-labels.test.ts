import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { getWeekDayLabels } from "../get-week-day-labels";

describe("getWeekDayLabels", () => {
  it("returns an array of exactly 7 items", async () => {
    const labels = await getWeekDayLabels({ language: "en" });
    expect(labels).toHaveLength(7);
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
  ])("returns 7 non-empty strings for language: %s", async (lang) => {
    const labels = await getWeekDayLabels({
      language: lang as SupportedLanguage,
    });
    expect(labels).toHaveLength(7);
    labels.forEach((label) => {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it.each([["short"], ["long"], ["narrow"]] as const)(
    "returns labels for formatStyle: %s",
    async (formatStyle) => {
      const labels = await getWeekDayLabels({ language: "en", formatStyle });
      expect(labels).toHaveLength(7);
      labels.forEach((label) => {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
      });
    },
  );

  it("long labels are longer than or equal to narrow labels", async () => {
    const long = await getWeekDayLabels({
      language: "en",
      formatStyle: "long",
    });
    const narrow = await getWeekDayLabels({
      language: "en",
      formatStyle: "narrow",
    });
    long.forEach((label, i) => {
      expect(label.length).toBeGreaterThanOrEqual(narrow[i].length);
    });
  });

  it("startOnSunday=true puts Sunday first (index 0)", async () => {
    const labels = await getWeekDayLabels({
      language: "en",
      startOnSunday: true,
      formatStyle: "long",
    });
    expect(labels[0].toLowerCase()).toContain("sun");
  });

  it("startOnSunday=false puts Monday first (index 0)", async () => {
    const labels = await getWeekDayLabels({
      language: "en",
      startOnSunday: false,
      formatStyle: "long",
    });
    expect(labels[0].toLowerCase()).toContain("mon");
  });

  it("uses default language 'en' when language is omitted", async () => {
    const labels = await getWeekDayLabels({});
    expect(labels).toHaveLength(7);
  });
});
