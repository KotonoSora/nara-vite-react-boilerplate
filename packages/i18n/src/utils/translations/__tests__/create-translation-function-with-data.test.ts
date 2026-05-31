import { describe, expect, it, vi } from "vitest";

import type { NestedTranslationObject } from "@kotonosora/i18n-locales";
import type { SupportedLanguage } from "@kotonosora/i18n-types";

import { createTranslationFunctionWithData } from "../create-translation-function-with-data";

const mockTranslations = {
  greeting: "Hello",
  farewell: "Goodbye",
  user: {
    welcome: "Welcome, {{name}}!",
    profile: {
      title: "Profile",
    },
  },
  count: "You have {{count}} items",
} as unknown as NestedTranslationObject;

describe("createTranslationFunctionWithData", () => {
  it("returns a function", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    expect(typeof t).toBe("function");
  });

  it("translates a top-level key", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    expect(t("greeting")).toBe("Hello");
    expect(t("farewell")).toBe("Goodbye");
  });

  it("translates a nested key using dot notation", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    expect(t("user.welcome" as any, { name: "Alice" })).toBe("Welcome, Alice!");
    expect(t("user.profile.title" as any)).toBe("Profile");
  });

  it("interpolates string parameters", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    expect(t("user.welcome" as any, { name: "Bob" })).toBe("Welcome, Bob!");
  });

  it("interpolates numeric parameters", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    expect(t("count" as any, { count: 5 })).toBe("You have 5 items");
  });

  it("leaves unreplaced placeholders when param is missing", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    expect(t("user.welcome" as any)).toBe("Welcome, {{name}}!");
  });

  it("returns the key itself when translation is not found", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    const result = t("nonexistent.key" as any);
    expect(result).toBe("nonexistent.key");
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("nonexistent.key"),
    );
    consoleSpy.mockRestore();
  });

  it("warns to console when translation is not found", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = createTranslationFunctionWithData(mockTranslations, "fr");
    t("missing.key" as any);
    expect(consoleSpy).toHaveBeenCalledOnce();
    consoleSpy.mockRestore();
  });

  it("creates independent translators for different languages", () => {
    const tEn = createTranslationFunctionWithData(
      mockTranslations,
      "en" as SupportedLanguage,
    );
    const tFr = createTranslationFunctionWithData(
      mockTranslations,
      "fr" as SupportedLanguage,
    );
    // Both use the same data source here, but are separate function instances
    expect(tEn).not.toBe(tFr);
    expect(tEn("greeting")).toBe("Hello");
    expect(tFr("greeting")).toBe("Hello");
  });

  it("works with an empty translations object", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = createTranslationFunctionWithData(
      {} as unknown as NestedTranslationObject,
      "en",
    );
    expect(t("any.key" as any)).toBe("any.key");
    consoleSpy.mockRestore();
  });

  it("ignores extra params not present in the translation string", () => {
    const t = createTranslationFunctionWithData(mockTranslations, "en");
    const result = t("greeting" as any, { extra: "unused", name: "Alice" });
    expect(result).toBe("Hello");
  });
});
