import { describe, expect, it, vi } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { getTranslation } from "../get-translation";

describe("getTranslation", () => {
  it.each([
    ["en", "Loading..."],
    ["fr", "Chargement..."],
    ["es", "Cargando..."],
    ["zh", "加载中..."],
    ["hi", "लोड हो रहा है..."],
    ["ar", "جارٍ التحميل..."],
    ["vi", "Đang tải..."],
    ["ja", "読み込み中..."],
    ["th", "กำลังโหลด..."],
  ])("retrieves translation for language: %s", (lang, expected) => {
    expect(getTranslation(lang as SupportedLanguage, "loading" as any)).toBe(
      expected,
    );
  });

  it("handles parameter interpolation with missing/extra params", () => {
    expect(
      getTranslation("en" as SupportedLanguage, "Hello {{name}}" as any, {
        name: "John",
        extra: "foo",
      }),
    ).toBe("Hello John");
    expect(
      getTranslation("en" as SupportedLanguage, "Hello {{name}}" as any, {}),
    ).toBe("Hello {{name}}");
  });

  it("falls back to default language for missing key", () => {
    expect(
      getTranslation("fr" as SupportedLanguage, "nonexistent.key" as any),
    ).toBe("nonexistent.key");
  });

  it("returns key itself if translation not found and warns", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const key = "completely.nonexistent.key";
    const result = getTranslation("en" as SupportedLanguage, key as any);
    expect(result).toBe(key);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
