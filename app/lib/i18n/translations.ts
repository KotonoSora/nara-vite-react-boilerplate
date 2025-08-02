import type { SupportedLanguage } from "./config";
import type { NestedTranslationObject, TranslationKey } from "./types";

// Import translation files
// Import namespace files for Arabic
import arAuth from "~/locales/ar/auth.json";
import arCommon from "~/locales/ar/common.json";
import arDashboard from "~/locales/ar/dashboard.json";
import arErrors from "~/locales/ar/errors.json";
import arLanding from "~/locales/ar/landing.json";
import arNavigation from "~/locales/ar/navigation.json";
import arShowcase from "~/locales/ar/showcase.json";
import arTheme from "~/locales/ar/theme.json";
import arTime from "~/locales/ar/time.json";
// Import namespace files for English
import enAuth from "~/locales/en/auth.json";
import enCommon from "~/locales/en/common.json";
import enDashboard from "~/locales/en/dashboard.json";
import enErrors from "~/locales/en/errors.json";
import enLanding from "~/locales/en/landing.json";
import enNavigation from "~/locales/en/navigation.json";
import enShowcase from "~/locales/en/showcase.json";
import enTheme from "~/locales/en/theme.json";
import enTime from "~/locales/en/time.json";
// Import namespace files for Spanish
import esAuth from "~/locales/es/auth.json";
import esCommon from "~/locales/es/common.json";
import esDashboard from "~/locales/es/dashboard.json";
import esErrors from "~/locales/es/errors.json";
import esLanding from "~/locales/es/landing.json";
import esNavigation from "~/locales/es/navigation.json";
import esShowcase from "~/locales/es/showcase.json";
import esTheme from "~/locales/es/theme.json";
import esTime from "~/locales/es/time.json";
// Import namespace files for French
import frAuth from "~/locales/fr/auth.json";
import frCommon from "~/locales/fr/common.json";
import frDashboard from "~/locales/fr/dashboard.json";
import frErrors from "~/locales/fr/errors.json";
import frLanding from "~/locales/fr/landing.json";
import frNavigation from "~/locales/fr/navigation.json";
import frShowcase from "~/locales/fr/showcase.json";
import frTheme from "~/locales/fr/theme.json";
import frTime from "~/locales/fr/time.json";
// Import namespace files for Hindi
import hiAuth from "~/locales/hi/auth.json";
import hiCommon from "~/locales/hi/common.json";
import hiDashboard from "~/locales/hi/dashboard.json";
import hiErrors from "~/locales/hi/errors.json";
import hiLanding from "~/locales/hi/landing.json";
import hiNavigation from "~/locales/hi/navigation.json";
import hiShowcase from "~/locales/hi/showcase.json";
import hiTheme from "~/locales/hi/theme.json";
import hiTime from "~/locales/hi/time.json";
// Import namespace files for Japanese
import jaAuth from "~/locales/ja/auth.json";
import jaCommon from "~/locales/ja/common.json";
import jaDashboard from "~/locales/ja/dashboard.json";
import jaErrors from "~/locales/ja/errors.json";
import jaLanding from "~/locales/ja/landing.json";
import jaNavigation from "~/locales/ja/navigation.json";
import jaShowcase from "~/locales/ja/showcase.json";
import jaTheme from "~/locales/ja/theme.json";
import jaTime from "~/locales/ja/time.json";
// Import namespace files for Thai
import thAuth from "~/locales/th/auth.json";
import thCommon from "~/locales/th/common.json";
import thDashboard from "~/locales/th/dashboard.json";
import thErrors from "~/locales/th/errors.json";
import thLanding from "~/locales/th/landing.json";
import thNavigation from "~/locales/th/navigation.json";
import thShowcase from "~/locales/th/showcase.json";
import thTheme from "~/locales/th/theme.json";
import thTime from "~/locales/th/time.json";
// Import namespace files for Vietnamese
import viAuth from "~/locales/vi/auth.json";
import viCommon from "~/locales/vi/common.json";
import viDashboard from "~/locales/vi/dashboard.json";
import viErrors from "~/locales/vi/errors.json";
import viLanding from "~/locales/vi/landing.json";
import viNavigation from "~/locales/vi/navigation.json";
import viShowcase from "~/locales/vi/showcase.json";
import viTheme from "~/locales/vi/theme.json";
import viTime from "~/locales/vi/time.json";
// Import namespace files for Chinese
import zhAuth from "~/locales/zh/auth.json";
import zhCommon from "~/locales/zh/common.json";
import zhDashboard from "~/locales/zh/dashboard.json";
import zhErrors from "~/locales/zh/errors.json";
import zhLanding from "~/locales/zh/landing.json";
import zhNavigation from "~/locales/zh/navigation.json";
import zhShowcase from "~/locales/zh/showcase.json";
import zhTheme from "~/locales/zh/theme.json";
import zhTime from "~/locales/zh/time.json";

import { DEFAULT_LANGUAGE } from "./config";

const translations: Record<SupportedLanguage, NestedTranslationObject> = {
  en: {
    ...enCommon,
    navigation: enNavigation,
    auth: enAuth,
    dashboard: enDashboard,
    errors: enErrors,
    showcase: enShowcase,
    time: enTime,
    theme: enTheme,
    landing: enLanding,
  },
  es: {
    ...esCommon,
    navigation: esNavigation,
    auth: esAuth,
    dashboard: esDashboard,
    errors: esErrors,
    showcase: esShowcase,
    time: esTime,
    theme: esTheme,
    landing: esLanding,
  },
  fr: {
    ...frCommon,
    navigation: frNavigation,
    auth: frAuth,
    dashboard: frDashboard,
    errors: frErrors,
    showcase: frShowcase,
    time: frTime,
    theme: frTheme,
    landing: frLanding,
  },
  zh: {
    ...zhCommon,
    navigation: zhNavigation,
    auth: zhAuth,
    dashboard: zhDashboard,
    errors: zhErrors,
    showcase: zhShowcase,
    time: zhTime,
    theme: zhTheme,
    landing: zhLanding,
  },
  hi: {
    ...hiCommon,
    navigation: hiNavigation,
    auth: hiAuth,
    dashboard: hiDashboard,
    errors: hiErrors,
    showcase: hiShowcase,
    time: hiTime,
    theme: hiTheme,
    landing: hiLanding,
  },
  ar: {
    ...arCommon,
    navigation: arNavigation,
    auth: arAuth,
    dashboard: arDashboard,
    errors: arErrors,
    showcase: arShowcase,
    time: arTime,
    theme: arTheme,
    landing: arLanding,
  },
  vi: {
    ...viCommon,
    navigation: viNavigation,
    auth: viAuth,
    dashboard: viDashboard,
    errors: viErrors,
    showcase: viShowcase,
    time: viTime,
    theme: viTheme,
    landing: viLanding,
  },
  ja: {
    ...jaCommon,
    navigation: jaNavigation,
    auth: jaAuth,
    dashboard: jaDashboard,
    errors: jaErrors,
    showcase: jaShowcase,
    time: jaTime,
    theme: jaTheme,
    landing: jaLanding,
  },
  th: {
    ...thCommon,
    navigation: thNavigation,
    auth: thAuth,
    dashboard: thDashboard,
    errors: thErrors,
    showcase: thShowcase,
    time: thTime,
    theme: thTheme,
    landing: thLanding,
  },
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
