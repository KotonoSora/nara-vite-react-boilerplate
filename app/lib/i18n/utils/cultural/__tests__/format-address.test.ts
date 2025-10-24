import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";
import type { Address } from "../../../types/cultural";

import { formatAddress } from "../format-address";

describe("formatAddress", () => {
  const sampleAddress: Address = {
    name: "John Doe",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
  };

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
  ])("formats address in single line for language: %s", (lang) => {
    const result = formatAddress(sampleAddress, lang as SupportedLanguage);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([["en"], ["fr"], ["es"], ["ja"], ["vi"], ["zh"]])(
    "formats address in multiline for language: %s",
    (lang) => {
      const result = formatAddress(sampleAddress, lang as SupportedLanguage, {
        multiline: true,
      });
      expect(result).toContain("John Doe");
      expect(result).toContain("123 Main St");
      expect(result.split("\n").length).toBeGreaterThan(1);
    },
  );

  it("excludes country when includeCountry is false", () => {
    const result = formatAddress(sampleAddress, "en" as SupportedLanguage, {
      includeCountry: false,
    });
    expect(result).not.toContain("USA");
  });

  it("handles Asian format for Chinese (postal code before city)", () => {
    const result = formatAddress(sampleAddress, "zh" as SupportedLanguage, {
      multiline: true,
    });
    expect(result).toBeTruthy();
    expect(result).toContain("John Doe");
  });

  it("handles Asian format for Japanese", () => {
    const result = formatAddress(sampleAddress, "ja" as SupportedLanguage, {
      multiline: true,
    });
    expect(result).toBeTruthy();
  });

  it("handles partial address with missing fields", () => {
    const partialAddress: Address = {
      name: "Jane Smith",
      city: "Los Angeles",
      country: "USA",
    };
    const result = formatAddress(partialAddress, "en" as SupportedLanguage);
    expect(result).toContain("Jane Smith");
    expect(result).toContain("Los Angeles");
    expect(result).not.toContain("undefined");
  });

  it("handles minimal address with only name", () => {
    const minimalAddress: Address = {
      name: "John Doe",
    };
    const result = formatAddress(minimalAddress, "en" as SupportedLanguage);
    expect(result).toBe("John Doe");
  });

  it("handles address without name", () => {
    const addressNoName: Address = {
      street: "456 Elm St",
      city: "Boston",
      state: "MA",
      postalCode: "02101",
    };
    const result = formatAddress(addressNoName, "en" as SupportedLanguage, {
      multiline: true,
    });
    expect(result).toContain("456 Elm St");
    expect(result).not.toContain("undefined");
  });

  it("handles empty address object", () => {
    const emptyAddress: Address = {};
    const result = formatAddress(emptyAddress, "en" as SupportedLanguage);
    expect(result).toBe("");
  });

  it("includes country in multiline format when specified", () => {
    const result = formatAddress(sampleAddress, "en" as SupportedLanguage, {
      multiline: true,
      includeCountry: true,
    });
    expect(result).toContain("USA");
  });

  it("excludes country in multiline format when not specified", () => {
    const result = formatAddress(sampleAddress, "en" as SupportedLanguage, {
      multiline: true,
      includeCountry: false,
    });
    expect(result).not.toContain("USA");
  });
});
