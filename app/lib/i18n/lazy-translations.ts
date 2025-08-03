import type { SupportedLanguage } from "./config";
import type { NestedTranslationObject } from "./types";

// Translation cache to avoid re-loading
const translationCache = new Map<string, NestedTranslationObject>();

// Type for lazy translation loader
type TranslationLoader = () => Promise<NestedTranslationObject>;

/**
 * Creates a lazy loader for a specific language's translations
 */
function createTranslationLoader(language: SupportedLanguage): TranslationLoader {
  return async (): Promise<NestedTranslationObject> => {
    const cacheKey = language;
    
    // Return cached translation if available
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Dynamically import translation files based on language
    const [
      commonModule,
      navigationModule,
      authModule,
      adminModule,
      dashboardModule,
      errorsModule,
      showcaseModule,
      timeModule,
      themeModule,
      landingModule,
    ] = await Promise.all([
      import(`~/locales/${language}/common.json`),
      import(`~/locales/${language}/navigation.json`),
      import(`~/locales/${language}/auth.json`),
      import(`~/locales/${language}/admin.json`),
      import(`~/locales/${language}/dashboard.json`),
      import(`~/locales/${language}/errors.json`),
      import(`~/locales/${language}/showcase.json`),
      import(`~/locales/${language}/time.json`),
      import(`~/locales/${language}/theme.json`),
      import(`~/locales/${language}/landing.json`),
    ]);

    const translations: NestedTranslationObject = {
      ...commonModule.default,
      navigation: navigationModule.default,
      auth: authModule.default,
      admin: adminModule.default,
      dashboard: dashboardModule.default,
      errors: errorsModule.default,
      showcase: showcaseModule.default,
      time: timeModule.default,
      theme: themeModule.default,
      landing: landingModule.default,
    };

    // Cache the loaded translations
    translationCache.set(cacheKey, translations);
    
    return translations;
  };
}

/**
 * Loads translations for a specific language
 */
export async function loadTranslations(
  language: SupportedLanguage,
): Promise<NestedTranslationObject> {
  const loader = createTranslationLoader(language);
  return await loader();
}

/**
 * Preloads translations for a language (for performance optimization)
 */
export function preloadTranslations(language: SupportedLanguage): void {
  // Start loading in the background without awaiting
  loadTranslations(language).catch((error) => {
    console.warn(`Failed to preload translations for ${language}:`, error);
  });
}

/**
 * Clears translation cache (useful for testing or memory management)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Gets cache size for debugging
 */
export function getTranslationCacheSize(): number {
  return translationCache.size;
}