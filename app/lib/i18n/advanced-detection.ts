import type { SupportedLanguage } from "./config";

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
} from "./config";

// Geographic regions for language preference inference
export const LANGUAGE_REGIONS: Record<SupportedLanguage, string[]> = {
  en: ["US", "GB", "CA", "AU", "NZ", "IE", "ZA"],
  es: [
    "ES",
    "MX",
    "AR",
    "CO",
    "VE",
    "PE",
    "CL",
    "EC",
    "GT",
    "CU",
    "BO",
    "DO",
    "HN",
    "PY",
    "SV",
    "NI",
    "CR",
    "PA",
    "UY",
  ],
  fr: [
    "FR",
    "CA",
    "BE",
    "CH",
    "LU",
    "MC",
    "SN",
    "CI",
    "BF",
    "ML",
    "NE",
    "TG",
    "BJ",
    "CF",
    "TD",
  ],
  zh: ["CN", "TW", "HK", "MO", "SG"],
  hi: ["IN", "NP"],
  ar: [
    "SA",
    "AE",
    "QA",
    "KW",
    "BH",
    "OM",
    "JO",
    "LB",
    "SY",
    "IQ",
    "YE",
    "EG",
    "LY",
    "TN",
    "DZ",
    "MA",
    "SD",
  ],
  vi: ["VN"],
  ja: ["JP"],
  th: ["TH"],
} as const;

// Browser language to supported language mapping
export const BROWSER_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  // English variants
  en: "en",
  "en-US": "en",
  "en-GB": "en",
  "en-CA": "en",
  "en-AU": "en",

  // Spanish variants
  es: "es",
  "es-ES": "es",
  "es-MX": "es",
  "es-AR": "es",
  "es-CO": "es",

  // French variants
  fr: "fr",
  "fr-FR": "fr",
  "fr-CA": "fr",
  "fr-BE": "fr",
  "fr-CH": "fr",

  // Chinese variants
  zh: "zh",
  "zh-CN": "zh",
  "zh-TW": "zh",
  "zh-HK": "zh",
  "zh-SG": "zh",

  // Hindi variants
  hi: "hi",
  "hi-IN": "hi",

  // Arabic variants
  ar: "ar",
  "ar-SA": "ar",
  "ar-AE": "ar",
  "ar-EG": "ar",
  "ar-MA": "ar",

  // Vietnamese
  vi: "vi",
  "vi-VN": "vi",

  // Japanese
  ja: "ja",
  "ja-JP": "ja",

  // Thai
  th: "th",
  "th-TH": "th",
} as const;

// User preference storage interface
export interface UserLanguagePreferences {
  primaryLanguage: SupportedLanguage;
  fallbackLanguages: SupportedLanguage[];
  lastUsed: string; // ISO date string
  detectionMethod: "manual" | "browser" | "geographic" | "default";
  timezone?: string;
  region?: string;
}

// Enhanced language detection options
export interface LanguageDetectionOptions {
  acceptLanguageHeader?: string;
  userAgent?: string;
  timezone?: string;
  region?: string;
  fallbackChain?: SupportedLanguage[];
  preferenceScore?: boolean;
}

// Language detection result with confidence score
export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number; // 0-1
  method: "preference" | "browser" | "geographic" | "fallback" | "default";
  fallbackChain: SupportedLanguage[];
}

/**
 * Advanced language detection with multiple strategies
 */
export function detectLanguageAdvanced(
  options: LanguageDetectionOptions = {},
): LanguageDetectionResult {
  const {
    acceptLanguageHeader,
    userAgent,
    timezone,
    region,
    fallbackChain = [],
    preferenceScore = true,
  } = options;

  let detectedLanguage: SupportedLanguage = DEFAULT_LANGUAGE;
  let confidence = 0.1; // default confidence
  let method: LanguageDetectionResult["method"] = "default";
  let finalFallbackChain = [...fallbackChain];

  // Strategy 1: Browser Accept-Language header (highest priority)
  if (acceptLanguageHeader) {
    const browserResult = detectFromAcceptLanguage(acceptLanguageHeader);
    if (browserResult.language !== DEFAULT_LANGUAGE) {
      detectedLanguage = browserResult.language;
      confidence = Math.max(confidence, browserResult.confidence);
      method = "browser";
      finalFallbackChain = [
        detectedLanguage,
        ...browserResult.fallbackChain,
        ...finalFallbackChain,
      ];
    }
  }

  // Strategy 2: Geographic region inference
  if (region && confidence < 0.8) {
    const geoResult = detectFromRegion(region);
    if (
      geoResult.language !== DEFAULT_LANGUAGE &&
      geoResult.confidence > confidence
    ) {
      detectedLanguage = geoResult.language;
      confidence = geoResult.confidence;
      method = "geographic";
      finalFallbackChain = [
        detectedLanguage,
        ...geoResult.fallbackChain,
        ...finalFallbackChain,
      ];
    }
  }

  // Strategy 3: Timezone inference (backup)
  if (timezone && confidence < 0.6) {
    const timezoneResult = detectFromTimezone(timezone);
    if (
      timezoneResult.language !== DEFAULT_LANGUAGE &&
      timezoneResult.confidence > confidence
    ) {
      detectedLanguage = timezoneResult.language;
      confidence = timezoneResult.confidence;
      method = "geographic";
      finalFallbackChain = [
        detectedLanguage,
        ...timezoneResult.fallbackChain,
        ...finalFallbackChain,
      ];
    }
  }

  // Remove duplicates from fallback chain
  finalFallbackChain = Array.from(new Set(finalFallbackChain));

  return {
    language: detectedLanguage,
    confidence,
    method,
    fallbackChain: finalFallbackChain,
  };
}

/**
 * Detect language from Accept-Language header with quality scores
 */
function detectFromAcceptLanguage(
  acceptLanguage: string,
): LanguageDetectionResult {
  if (!acceptLanguage) {
    return {
      language: DEFAULT_LANGUAGE,
      confidence: 0.1,
      method: "default",
      fallbackChain: [],
    };
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality = "1"] = lang.trim().split(";q=");
      const normalizedCode = code.trim().toLowerCase();
      return {
        code: normalizedCode,
        quality: parseFloat(quality),
        mapped:
          BROWSER_LANGUAGE_MAP[normalizedCode] ||
          BROWSER_LANGUAGE_MAP[normalizedCode.split("-")[0]] ||
          null,
      };
    })
    .filter((item) => item.mapped && isSupportedLanguage(item.mapped))
    .sort((a, b) => b.quality - a.quality);

  if (languages.length === 0) {
    return {
      language: DEFAULT_LANGUAGE,
      confidence: 0.1,
      method: "default",
      fallbackChain: [],
    };
  }

  const primary = languages[0];
  const fallbackChain = languages
    .slice(1)
    .map((l) => l.mapped!)
    .filter(Boolean);

  return {
    language: primary.mapped!,
    confidence: Math.min(0.9, primary.quality * 0.8 + 0.1),
    method: "browser",
    fallbackChain: Array.from(new Set(fallbackChain)),
  };
}

/**
 * Detect language from geographic region
 */
function detectFromRegion(region: string): LanguageDetectionResult {
  const upperRegion = region.toUpperCase();

  for (const [language, regions] of Object.entries(LANGUAGE_REGIONS)) {
    if (regions.includes(upperRegion)) {
      // Calculate confidence based on language prevalence in region
      const confidence = calculateRegionalConfidence(
        language as SupportedLanguage,
        upperRegion,
      );
      return {
        language: language as SupportedLanguage,
        confidence,
        method: "geographic",
        fallbackChain: getRegionalFallbacks(
          language as SupportedLanguage,
          upperRegion,
        ),
      };
    }
  }

  return {
    language: DEFAULT_LANGUAGE,
    confidence: 0.1,
    method: "default",
    fallbackChain: [],
  };
}

/**
 * Detect language from timezone
 */
function detectFromTimezone(timezone: string): LanguageDetectionResult {
  const timezoneMap: Record<
    string,
    { language: SupportedLanguage; confidence: number }
  > = {
    // English-speaking regions
    "America/New_York": { language: "en", confidence: 0.7 },
    "America/Los_Angeles": { language: "en", confidence: 0.7 },
    "Europe/London": { language: "en", confidence: 0.8 },
    "Australia/Sydney": { language: "en", confidence: 0.8 },

    // Spanish-speaking regions
    "Europe/Madrid": { language: "es", confidence: 0.8 },
    "America/Mexico_City": { language: "es", confidence: 0.8 },
    "America/Argentina/Buenos_Aires": { language: "es", confidence: 0.8 },

    // French-speaking regions
    "Europe/Paris": { language: "fr", confidence: 0.8 },
    "America/Montreal": { language: "fr", confidence: 0.7 },

    // Chinese-speaking regions
    "Asia/Shanghai": { language: "zh", confidence: 0.9 },
    "Asia/Hong_Kong": { language: "zh", confidence: 0.8 },
    "Asia/Taipei": { language: "zh", confidence: 0.8 },

    // Other languages
    "Asia/Tokyo": { language: "ja", confidence: 0.9 },
    "Asia/Bangkok": { language: "th", confidence: 0.9 },
    "Asia/Ho_Chi_Minh": { language: "vi", confidence: 0.9 },
    "Asia/Kolkata": { language: "hi", confidence: 0.7 },
    "Asia/Riyadh": { language: "ar", confidence: 0.8 },
  };

  const match = timezoneMap[timezone];
  if (match) {
    return {
      language: match.language,
      confidence: match.confidence,
      method: "geographic",
      fallbackChain: getTimezoneBasedFallbacks(match.language),
    };
  }

  // Fallback based on timezone continent
  if (timezone.startsWith("Asia/")) {
    return {
      language: "en", // International fallback for Asia
      confidence: 0.3,
      method: "geographic",
      fallbackChain: ["zh", "ja", "hi"],
    };
  }

  return {
    language: DEFAULT_LANGUAGE,
    confidence: 0.2,
    method: "default",
    fallbackChain: [],
  };
}

/**
 * Calculate confidence based on language prevalence in region
 */
function calculateRegionalConfidence(
  language: SupportedLanguage,
  region: string,
): number {
  // Primary language regions get higher confidence
  const primaryRegions: Record<SupportedLanguage, string[]> = {
    en: ["US", "GB", "AU", "NZ"],
    es: ["ES", "MX", "AR"],
    fr: ["FR"],
    zh: ["CN", "TW"],
    hi: ["IN"],
    ar: ["SA", "AE"],
    vi: ["VN"],
    ja: ["JP"],
    th: ["TH"],
  };

  if (primaryRegions[language]?.includes(region)) {
    return 0.8;
  }

  return 0.6; // Secondary regions
}

/**
 * Get fallback languages based on geographic region
 */
function getRegionalFallbacks(
  language: SupportedLanguage,
  region: string,
): SupportedLanguage[] {
  const regionalFallbacks: Record<string, SupportedLanguage[]> = {
    // North America
    US: ["es"],
    CA: ["fr"],
    MX: ["en"],

    // Europe
    GB: ["fr"],
    FR: ["en"],
    ES: ["en", "fr"],
    DE: ["en"],

    // Asia
    CN: ["en"],
    JP: ["en", "zh"],
    IN: ["en"],
    TH: ["en"],
    VN: ["en", "zh"],

    // Middle East
    SA: ["en"],
    AE: ["en", "hi"],
  };

  return regionalFallbacks[region] || ["en"];
}

/**
 * Get fallback languages based on timezone detection
 */
function getTimezoneBasedFallbacks(
  language: SupportedLanguage,
): SupportedLanguage[] {
  const fallbacks: Record<SupportedLanguage, SupportedLanguage[]> = {
    en: ["es", "fr"],
    es: ["en"],
    fr: ["en"],
    zh: ["en", "ja"],
    hi: ["en"],
    ar: ["en"],
    vi: ["en", "zh"],
    ja: ["en", "zh"],
    th: ["en"],
  };

  return fallbacks[language] || ["en"];
}

/**
 * Save user language preferences to localStorage
 */
export function saveUserLanguagePreferences(
  preferences: UserLanguagePreferences,
): void {
  try {
    localStorage.setItem("nara-lang-preferences", JSON.stringify(preferences));
  } catch (error) {
    console.warn("Failed to save language preferences:", error);
  }
}

/**
 * Load user language preferences from localStorage
 */
export function loadUserLanguagePreferences(): UserLanguagePreferences | null {
  try {
    const stored = localStorage.getItem("nara-lang-preferences");
    if (stored) {
      const preferences = JSON.parse(stored) as UserLanguagePreferences;
      // Validate stored preferences
      if (
        isSupportedLanguage(preferences.primaryLanguage) &&
        Array.isArray(preferences.fallbackLanguages) &&
        preferences.fallbackLanguages.every((lang) => isSupportedLanguage(lang))
      ) {
        return preferences;
      }
    }
  } catch (error) {
    console.warn("Failed to load language preferences:", error);
  }

  return null;
}

/**
 * Create intelligent language suggestion based on usage patterns
 */
export function suggestLanguageForUser(
  currentLanguage: SupportedLanguage,
  userAgent?: string,
  timezone?: string,
  region?: string,
): SupportedLanguage[] {
  const suggestions: SupportedLanguage[] = [];

  // Get detection result for context
  const detection = detectLanguageAdvanced({
    userAgent,
    timezone,
    region,
  });

  // Add detected language if different from current
  if (detection.language !== currentLanguage && detection.confidence > 0.5) {
    suggestions.push(detection.language);
  }

  // Add fallback chain
  suggestions.push(
    ...detection.fallbackChain.filter((lang) => lang !== currentLanguage),
  );

  // Add common secondary languages based on primary language
  const commonSecondary: Record<SupportedLanguage, SupportedLanguage[]> = {
    en: ["es", "fr", "zh"],
    es: ["en", "fr"],
    fr: ["en", "es"],
    zh: ["en", "ja"],
    hi: ["en"],
    ar: ["en", "fr"],
    vi: ["en", "zh"],
    ja: ["en", "zh"],
    th: ["en"],
  };

  const secondary = commonSecondary[currentLanguage] || ["en"];
  suggestions.push(...secondary.filter((lang) => lang !== currentLanguage));

  // Remove duplicates and limit to 3 suggestions
  return Array.from(new Set(suggestions)).slice(0, 3);
}
