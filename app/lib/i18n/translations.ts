import type { SupportedLanguage } from "./config";
import type { NestedTranslationObject, TranslationKey } from "./types";

import { DEFAULT_LANGUAGE } from "./config";

// Cache for loaded translations
const translationCache = new Map<SupportedLanguage, NestedTranslationObject>();
const loadingPromises = new Map<SupportedLanguage, Promise<NestedTranslationObject>>();

// Lazy loading functions for each language
const translationLoaders: Record<SupportedLanguage, () => Promise<NestedTranslationObject>> = {
  en: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/en/common.json"),
      import("~/locales/en/navigation.json"),
      import("~/locales/en/auth.json"),
      import("~/locales/en/admin.json"),
      import("~/locales/en/dashboard.json"),
      import("~/locales/en/errors.json"),
      import("~/locales/en/showcase.json"),
      import("~/locales/en/time.json"),
      import("~/locales/en/theme.json"),
      import("~/locales/en/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  es: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/es/common.json"),
      import("~/locales/es/navigation.json"),
      import("~/locales/es/auth.json"),
      import("~/locales/es/admin.json"),
      import("~/locales/es/dashboard.json"),
      import("~/locales/es/errors.json"),
      import("~/locales/es/showcase.json"),
      import("~/locales/es/time.json"),
      import("~/locales/es/theme.json"),
      import("~/locales/es/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  fr: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/fr/common.json"),
      import("~/locales/fr/navigation.json"),
      import("~/locales/fr/auth.json"),
      import("~/locales/fr/admin.json"),
      import("~/locales/fr/dashboard.json"),
      import("~/locales/fr/errors.json"),
      import("~/locales/fr/showcase.json"),
      import("~/locales/fr/time.json"),
      import("~/locales/fr/theme.json"),
      import("~/locales/fr/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  zh: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/zh/common.json"),
      import("~/locales/zh/navigation.json"),
      import("~/locales/zh/auth.json"),
      import("~/locales/zh/admin.json"),
      import("~/locales/zh/dashboard.json"),
      import("~/locales/zh/errors.json"),
      import("~/locales/zh/showcase.json"),
      import("~/locales/zh/time.json"),
      import("~/locales/zh/theme.json"),
      import("~/locales/zh/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  hi: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/hi/common.json"),
      import("~/locales/hi/navigation.json"),
      import("~/locales/hi/auth.json"),
      import("~/locales/hi/admin.json"),
      import("~/locales/hi/dashboard.json"),
      import("~/locales/hi/errors.json"),
      import("~/locales/hi/showcase.json"),
      import("~/locales/hi/time.json"),
      import("~/locales/hi/theme.json"),
      import("~/locales/hi/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  ar: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/ar/common.json"),
      import("~/locales/ar/navigation.json"),
      import("~/locales/ar/auth.json"),
      import("~/locales/ar/admin.json"),
      import("~/locales/ar/dashboard.json"),
      import("~/locales/ar/errors.json"),
      import("~/locales/ar/showcase.json"),
      import("~/locales/ar/time.json"),
      import("~/locales/ar/theme.json"),
      import("~/locales/ar/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  vi: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/vi/common.json"),
      import("~/locales/vi/navigation.json"),
      import("~/locales/vi/auth.json"),
      import("~/locales/vi/admin.json"),
      import("~/locales/vi/dashboard.json"),
      import("~/locales/vi/errors.json"),
      import("~/locales/vi/showcase.json"),
      import("~/locales/vi/time.json"),
      import("~/locales/vi/theme.json"),
      import("~/locales/vi/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  ja: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/ja/common.json"),
      import("~/locales/ja/navigation.json"),
      import("~/locales/ja/auth.json"),
      import("~/locales/ja/admin.json"),
      import("~/locales/ja/dashboard.json"),
      import("~/locales/ja/errors.json"),
      import("~/locales/ja/showcase.json"),
      import("~/locales/ja/time.json"),
      import("~/locales/ja/theme.json"),
      import("~/locales/ja/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
  th: async () => {
    const [common, navigation, auth, admin, dashboard, errors, showcase, time, theme, landing] = await Promise.all([
      import("~/locales/th/common.json"),
      import("~/locales/th/navigation.json"),
      import("~/locales/th/auth.json"),
      import("~/locales/th/admin.json"),
      import("~/locales/th/dashboard.json"),
      import("~/locales/th/errors.json"),
      import("~/locales/th/showcase.json"),
      import("~/locales/th/time.json"),
      import("~/locales/th/theme.json"),
      import("~/locales/th/landing.json"),
    ]);
    return {
      ...common.default,
      navigation: navigation.default,
      auth: auth.default,
      admin: admin.default,
      dashboard: dashboard.default,
      errors: errors.default,
      showcase: showcase.default,
      time: time.default,
      theme: theme.default,
      landing: landing.default,
    };
  },
};

async function loadTranslations(language: SupportedLanguage): Promise<NestedTranslationObject> {
  // Return cached version if available
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  // Return existing loading promise if already in progress
  if (loadingPromises.has(language)) {
    return loadingPromises.get(language)!;
  }

  // Start loading
  const loadingPromise = translationLoaders[language]();
  loadingPromises.set(language, loadingPromise);

  try {
    const translations = await loadingPromise;
    translationCache.set(language, translations);
    loadingPromises.delete(language);
    return translations;
  } catch (error) {
    loadingPromises.delete(language);
    throw error;
  }
}

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

// Synchronous version for when translations are already loaded
export function getTranslation(
  language: SupportedLanguage,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const languageTranslations = translationCache.get(language);
  const fallbackTranslations = translationCache.get(DEFAULT_LANGUAGE);

  // Try to get translation from the requested language
  let translation = languageTranslations ? getNestedValue(languageTranslations, key) : undefined;

  // Fallback to default language if translation not found
  if (translation === undefined && fallbackTranslations) {
    translation = getNestedValue(fallbackTranslations, key);
  }

  // Final fallback to the key itself if nothing is found
  if (translation === undefined) {
    if (import.meta.env.DEV) {
      console.warn(
        `Translation not found for key: ${key} in language: ${language}`,
      );
    }
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

// Async version that ensures translations are loaded
export async function getTranslationAsync(
  language: SupportedLanguage,
  key: TranslationKey,
  params?: Record<string, string | number>,
): Promise<string> {
  // Ensure translations are loaded
  await loadTranslations(language);
  
  // Also load default language as fallback if different
  if (language !== DEFAULT_LANGUAGE) {
    await loadTranslations(DEFAULT_LANGUAGE);
  }

  return getTranslation(language, key, params);
}

export function createTranslationFunction(language: SupportedLanguage) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(language, key, params);
}

export async function createTranslationFunctionAsync(language: SupportedLanguage) {
  await loadTranslations(language);
  if (language !== DEFAULT_LANGUAGE) {
    await loadTranslations(DEFAULT_LANGUAGE);
  }
  return createTranslationFunction(language);
}

// Pre-load translations for critical languages (e.g., default language)
export async function preloadTranslations(language: SupportedLanguage): Promise<void> {
  await loadTranslations(language);
}

// Check if translations are loaded
export function areTranslationsLoaded(language: SupportedLanguage): boolean {
  return translationCache.has(language);
}
