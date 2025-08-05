import type { SupportedLanguage } from "./config";

import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
} from "./config";
import {
  createTranslationFunctionAsync,
  preloadTranslations,
  areTranslationsLoaded,
} from "./translations";

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  t: (key: string, params?: Record<string, string | number>) => string;
}

/**
 * Enhanced language detection and translation loading for route loaders
 * 
 * This function provides a unified approach to:
 * - Detect language from URL params, cookies, and browser headers
 * - Preload translations asynchronously
 * - Return a translation function ready for use
 * - Handle fallbacks gracefully
 * 
 * Priority order: URL parameter > Cookie > Accept-Language header > Default
 */
export async function detectLanguageAndLoadTranslations(
  request: Request,
): Promise<LanguageDetectionResult> {
  const url = new URL(request.url);

  // 1. Try to get language from URL path (highest priority)
  const pathLanguage = getLanguageFromPath(url.pathname);

  // 2. Get language from cookie session (second priority)  
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();

  // 3. Detect from Accept-Language header (third priority)
  const acceptLanguage = detectLanguageFromAcceptLanguage(
    request.headers.get("Accept-Language") || "",
  );

  // 4. Determine final language with fallback hierarchy
  const language: SupportedLanguage =
    pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;

  // 5. Ensure translations are loaded before creating translation function
  await preloadTranslations(language);

  // 6. Also preload default language as fallback if different
  if (language !== DEFAULT_LANGUAGE && !areTranslationsLoaded(DEFAULT_LANGUAGE)) {
    await preloadTranslations(DEFAULT_LANGUAGE);
  }

  // 7. Create translation function
  const t = await createTranslationFunctionAsync(language);

  return {
    language,
    t,
  };
}

/**
 * Lightweight version for routes that only need the language
 * without preloading translations (e.g., when passing to meta functions)
 */
export async function detectLanguageOnly(request: Request): Promise<SupportedLanguage> {
  const url = new URL(request.url);
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const acceptLanguage = detectLanguageFromAcceptLanguage(
    request.headers.get("Accept-Language") || "",
  );

  return pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;
}

/**
 * Enhanced meta function helper that handles language detection
 * and translation loading for meta tags
 */
export async function createMetaWithTranslations(
  request: Request,
  metaGenerator: (t: (key: string, params?: Record<string, string | number>) => string) => Array<{ title?: string; name?: string; content?: string }>,
): Promise<Array<{ title?: string; name?: string; content?: string }>> {
  try {
    const { t } = await detectLanguageAndLoadTranslations(request);
    return metaGenerator(t);
  } catch (error) {
    console.error("Error in meta translation loading:", error);
    // Fallback meta tags
    return [
      { title: "NARA" },
      { name: "description", content: "Modern web application" },
    ];
  }
}