import { describe, expect, it } from "vitest";

import { getLanguageFromPath } from "../get-language-from-path";

describe("getLanguageFromPath", () => {
  it.each([
    ["/en/about", "en"],
    ["/fr/contact", "fr"],
    ["/es/page", "es"],
    ["/ja/home", "ja"],
    ["/vi/landing", "vi"],
    ["/ar/dashboard", "ar"],
    ["/zh/chart", "zh"],
    ["/hi/terms", "hi"],
    ["/th/privacy", "th"],
    ["/en", "en"],
    ["/fr", "fr"],
    ["/es", "es"],
  ])(
    "returns language from first segment if supported: %s",
    (path, expected) => {
      expect(getLanguageFromPath(path)).toBe(expected);
    },
  );

  it.each([
    ["/about"],
    ["/invalid/page"],
    ["/xx/home"],
    ["/yy/contact"],
    ["/"],
    [""],
    ["/enabout"],
    ["/frcontact"],
  ])("returns null if no valid language detected: %s", (path) => {
    expect(getLanguageFromPath(path)).toBeNull();
  });

  it("returns language from first segment even if other segments look like languages", () => {
    expect(getLanguageFromPath("/en/about/fr")).toBe("en");
    expect(getLanguageFromPath("/en/fr/about")).toBe("en");
    expect(getLanguageFromPath("/fr/en/page")).toBe("fr");
  });

  it("handles multiple slashes and edge cases", () => {
    expect(getLanguageFromPath("//en//about")).toBe("en");
    expect(getLanguageFromPath("///fr///contact")).toBe("fr");
    expect(getLanguageFromPath("/en//fr/about")).toBe("en");
  });
});
