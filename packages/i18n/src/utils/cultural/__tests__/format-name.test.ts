import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { formatName } from "../format-name";

describe("formatName", () => {
  const westernName = { first: "John", middle: "Michael", last: "Doe" };
  const simpleName = { first: "John", last: "Doe" };
  const asianName = { family: "张", first: "伟" };

  it.each([
    ["en", westernName],
    ["fr", westernName],
    ["es", westernName],
  ])("formats Western name for language: %s", (lang, name) => {
    const result = formatName(name, lang as SupportedLanguage);
    expect(result).toContain("John");
    expect(result).toContain("Doe");
    expect(typeof result).toBe("string");
  });

  it.each([
    ["en", "Mr."],
    ["en", "Dr."],
    ["en", "Mrs."],
    ["fr", "M."],
    ["es", "Sr."],
  ])("formats name with honorific for %s: %s", (lang, honorific) => {
    const result = formatName(simpleName, lang as SupportedLanguage, {
      honorific,
    });
    expect(result).toContain(honorific);
    expect(result).toContain("John");
  });

  it("formats formal name with middle initial", () => {
    const result = formatName(westernName, "en" as SupportedLanguage, {
      formal: true,
    });
    expect(result).toContain("M.");
    expect(result).toContain("John");
    expect(result).toContain("Doe");
  });

  it.each([
    ["zh", { last: "张", first: "伟" }],
    ["ja", { last: "田中", first: "太郎" }],
    ["vi", { last: "Nguyen", first: "Van" }],
  ])("handles Asian name format for language: %s", (lang, name) => {
    const result = formatName(name, lang as SupportedLanguage);
    if (lang === "zh") {
      // Chinese: no separator, family + first
      expect(result).toBe("张伟");
    } else if (lang === "ja") {
      // Japanese: last and first separated by space in our format
      expect(result).toBe("田中 太郎");
    } else if (lang === "vi") {
      // Vietnamese example: last then first
      expect(result).toBe("Nguyen Van");
    }
  });

  it("handles name with only first name", () => {
    const singleName = { first: "Madonna" };
    const result = formatName(singleName, "en" as SupportedLanguage);
    expect(result).toBe("Madonna");
  });

  it("handles name with only last name", () => {
    const lastNameOnly = { last: "Smith" };
    const result = formatName(lastNameOnly, "en" as SupportedLanguage);
    expect(result).toContain("Smith");
  });

  it("formats name without middle name", () => {
    const result = formatName(simpleName, "en" as SupportedLanguage);
    expect(result).toContain("John");
    expect(result).toContain("Doe");
  });

  it("formats formal name without middle name", () => {
    const result = formatName(simpleName, "en" as SupportedLanguage, {
      formal: true,
    });
    expect(result).toContain("John");
    expect(result).toContain("Doe");
  });

  it("combines honorific and formal options", () => {
    const result = formatName(westernName, "en" as SupportedLanguage, {
      honorific: "Dr.",
      formal: true,
    });
    expect(result).toContain("Dr.");
    expect(result).toContain("M.");
  });

  it("handles empty name object gracefully", () => {
    const emptyName = {};
    const result = formatName(emptyName, "en" as SupportedLanguage);
    // No components -> empty string
    expect(result).toBe("");
  });

  it("handles name with suffix", () => {
    const nameWithSuffix = { first: "John", last: "Doe", suffix: "Jr." };
    const result = formatName(nameWithSuffix, "en" as SupportedLanguage);
    // Current implementation ignores suffix, expect base formatted name
    expect(result).toBe("John Doe");
  });
});
