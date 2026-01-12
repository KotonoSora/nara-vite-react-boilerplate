import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { DEFAULT_LANGUAGE } from "../../../constants/common";
import { addLanguageToPath } from "../add-language-to-path";
import { removeLanguageFromPath } from "../remove-language-from-path";

describe("addLanguageToPath", () => {
  it.each([
    ["/about", DEFAULT_LANGUAGE, "/about"],
    ["/", DEFAULT_LANGUAGE, "/"],
    ["/fr/about", DEFAULT_LANGUAGE, "/about"],
  ])(
    "returns clean path for default language: %s, %s",
    (path, lang, expected) => {
      expect(addLanguageToPath(path, lang)).toBe(expected);
    },
  );

  it.each([
    ["/about", "fr", "/fr/about"],
    ["/", "fr", "/fr"],
    ["/contact", "es", "/es/contact"],
    ["/", "ja", "/ja"],
    ["/fr/about", "es", "/es/about"], // removes /fr first, then adds /es
    ["/en", "vi", "/vi"], // removes /en first (since it's supported), then adds /vi to /
  ])(
    "adds language prefix for non-default language: %s, %s",
    (path, lang, expected) => {
      expect(addLanguageToPath(path, lang as SupportedLanguage)).toBe(expected);
    },
  );

  it("handles empty path", () => {
    expect(addLanguageToPath("", "fr" as SupportedLanguage)).toBe("/fr");
    expect(addLanguageToPath("", DEFAULT_LANGUAGE)).toBe("");
  });

  it("handles path with multiple slashes", () => {
    expect(addLanguageToPath("//about", "fr" as SupportedLanguage)).toBe(
      "/fr//about",
    );
  });
});
