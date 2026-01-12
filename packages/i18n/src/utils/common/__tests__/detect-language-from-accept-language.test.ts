import { describe, expect, it } from "vitest";

import { DEFAULT_LANGUAGE } from "../../../constants/common";
import { detectLanguageFromAcceptLanguage } from "../detect-language-from-accept-language";

describe("detectLanguageFromAcceptLanguage", () => {
  it.each([
    [undefined, DEFAULT_LANGUAGE],
    [null, DEFAULT_LANGUAGE],
    ["", DEFAULT_LANGUAGE],
    ["xx,yy;q=0.8", DEFAULT_LANGUAGE],
    ["zz;q=0.5", DEFAULT_LANGUAGE],
  ])(
    "returns default language if input is invalid or none supported: %s",
    (input, expected) => {
      expect(detectLanguageFromAcceptLanguage(input as any)).toBe(expected);
    },
  );

  it.each([
    ["en-US,fr;q=0.8", "en"],
    ["fr;q=0.8,en;q=0.9", "en"],
    ["fr-FR,es;q=0.7", "fr"],
    ["es-ES,fr;q=0.8", "es"],
    ["ja-JP,en;q=0.5", "ja"],
    ["vi-VN,zh;q=0.6", "vi"],
    ["ar-EG,en;q=0.9", "ar"],
    ["en;q=0.9,fr;q=0.8,es;q=0.7", "en"],
  ])("returns supported language from header: %s", (input, expected) => {
    expect(detectLanguageFromAcceptLanguage(input)).toBe(expected);
  });

  it("handles malformed header string", () => {
    expect(detectLanguageFromAcceptLanguage(",,,")).toBe(DEFAULT_LANGUAGE);
    expect(detectLanguageFromAcceptLanguage("en;q=abc,fr;q=xyz")).toBe("en");
  });
});
