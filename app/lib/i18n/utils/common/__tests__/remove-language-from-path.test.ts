import { describe, expect, it } from "vitest";

import { removeLanguageFromPath } from "../remove-language-from-path";

describe("removeLanguageFromPath", () => {
  it.each([
    ["/en/about", "/about"],
    ["/fr/contact", "/contact"],
    ["/es/page", "/page"],
    ["/ja/home", "/home"],
    ["/vi/landing", "/landing"],
    ["/ar/dashboard", "/dashboard"],
    ["/zh/chart", "/chart"],
    ["/hi/terms", "/terms"],
    ["/th/privacy", "/privacy"],
    ["/en", "/"],
    ["/fr", "/"],
    ["/es", "/"],
    ["/en/about/contact", "/about/contact"],
    ["/fr/about/contact/us", "/about/contact/us"],
  ])(
    "removes language segment if present and supported: %s → %s",
    (path, expected) => {
      expect(removeLanguageFromPath(path)).toBe(expected);
    },
  );

  it.each([
    ["/about", "/about"],
    ["/contact", "/contact"],
    ["/", "/"],
    ["", ""], // empty string should return empty string, not "/"
    ["/invalid/page", "/invalid/page"],
    ["/xx/home", "/xx/home"],
    ["/yy/contact", "/yy/contact"],
    ["/enabout", "/enabout"],
    ["/frcontact", "/frcontact"],
  ])(
    "returns original pathname if no language segment: %s → %s",
    (path, expected) => {
      expect(removeLanguageFromPath(path)).toBe(expected);
    },
  );

  it("handles edge cases with multiple slashes", () => {
    // Multiple slashes get normalized by split/filter/join
    expect(removeLanguageFromPath("//en//about")).toBe("/about");
    expect(removeLanguageFromPath("///fr///contact")).toBe("/contact");
  });

  it("preserves query strings and hashes", () => {
    expect(removeLanguageFromPath("/en/about?lang=en")).toBe("/about?lang=en");
    expect(removeLanguageFromPath("/fr/contact#section")).toBe(
      "/contact#section",
    );
    expect(removeLanguageFromPath("/es/page?q=1#top")).toBe("/page?q=1#top");
  });
});
