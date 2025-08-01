import type { SupportedLanguage } from "./config";
import type { NestedTranslationObject, TranslationKey } from "./types";

// Import translation files
import arCommon from "~/locales/ar/common.json";
import enCommon from "~/locales/en/common.json";
import esCommon from "~/locales/es/common.json";
import frCommon from "~/locales/fr/common.json";
import hiCommon from "~/locales/hi/common.json";
import jaCommon from "~/locales/ja/common.json";
import thCommon from "~/locales/th/common.json";
import viCommon from "~/locales/vi/common.json";
import zhCommon from "~/locales/zh/common.json";

import { DEFAULT_LANGUAGE } from "./config";

const translations: Record<SupportedLanguage, NestedTranslationObject> = {
  en: enCommon,
  es: esCommon,
  fr: frCommon,
  zh: zhCommon,
  hi: hiCommon,
  ar: arCommon,
  vi: viCommon,
  ja: jaCommon,
  th: thCommon,
};

function getNestedValue(
  obj: NestedTranslationObject,
  path: string,
): string | undefined {
  return path.split(".").reduce<unknown>((current, key) => {
    return current &&
      typeof current === "object" &&
      current !== null &&
      key in current
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj) as string | undefined;
}

export function getTranslation(
  language: SupportedLanguage,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const languageTranslations = translations[language];
  const fallbackTranslations = translations[DEFAULT_LANGUAGE];

  // Try to get translation from the requested language
  let translation = getNestedValue(languageTranslations, key);

  // Fallback to default language if translation not found
  if (translation === undefined) {
    translation = getNestedValue(fallbackTranslations, key);
  }

  // Final fallback to the key itself if nothing is found
  if (translation === undefined) {
    console.warn(
      `Translation not found for key: ${key} in language: ${language}`,
    );
    translation = key;
  }

  // Handle parameter replacement
  if (params && typeof translation === "string") {
    Object.entries(params).forEach(([paramKey, value]) => {
      translation = translation!.replace(
        new RegExp(`{{${paramKey}}}`, "g"),
        String(value),
      );
    });
  }

  return translation;
}

export function createTranslationFunction(language: SupportedLanguage) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(language, key, params);
}
