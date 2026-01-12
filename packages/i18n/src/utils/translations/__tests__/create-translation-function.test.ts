import { describe, expect, it } from "vitest";

import type { SupportedLanguage } from "../../../types/common";

import { createTranslationFunction } from "../create-translation-function";

describe("createTranslationFunction", () => {
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
  ])("creates a translation function for language: %s", (lang, expected) => {
    const t = createTranslationFunction(lang as SupportedLanguage);
    expect(typeof t).toBe("function");
    expect(t("loading" as any)).toBe(expected);
  });

  it("handles parameter interpolation with missing/extra params", () => {
    const t = createTranslationFunction("en" as SupportedLanguage);
    expect(t("Hello {{name}}" as any, { name: "John", extra: "foo" })).toBe(
      "Hello John",
    );
    expect(t("Hello {{name}}" as any, {})).toBe("Hello {{name}}");
  });

  it("returns key itself if translation not found", () => {
    const t = createTranslationFunction("en" as SupportedLanguage);
    const key = "completely.nonexistent.key";
    expect(t(key as any)).toBe(key);
  });
});
