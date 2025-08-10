import { useCallback, useEffect, useState, useMemo } from "react";
import { useI18n } from "./context";
import type { SupportedLanguage } from "./config";
import type { TranslationKey } from "./types";
import {
  detectLanguageEnhanced,
  suggestLanguageForUser,
  saveUserLanguagePreferences,
  loadUserLanguagePreferences,
  type LanguageDetectionResult,
  type UserLanguagePreferences,
} from "./enhanced-detection";
import {
  formatAddress,
  formatPhoneNumber,
  formatName,
  getCulturalColor,
  isColorCulturallyAppropriate,
  type Address,
} from "./cultural-formatting";
import {
  announceToScreenReader,
  createLanguageChangeAnnouncement,
  registerKeyboardShortcuts,
  setupVoiceInput,
  manageFocusForDirection,
} from "./accessibility";
import {
  smartPreload,
  preloadLanguages,
  languageAnalytics,
  performanceMonitor,
  initializeI18nPerformance,
} from "./performance";

/**
 * Enhanced language detection hook
 */
export function useLanguageDetection() {
  const { language, setLanguage } = useI18n();
  const [detectionResult, setDetectionResult] = useState<LanguageDetectionResult | null>(null);
  const [preferences, setPreferences] = useState<UserLanguagePreferences | null>(null);

  const detectOptimalLanguage = useCallback(async () => {
    const userAgent = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Try to get user's region (would need geolocation API)
    let region: string | undefined;
    
    const result = detectLanguageEnhanced({
      acceptLanguageHeader: navigator.language,
      userAgent,
      timezone,
      region,
    });
    
    setDetectionResult(result);
    return result;
  }, []);

  const saveLanguagePreference = useCallback((newLanguage: SupportedLanguage, method: UserLanguagePreferences["detectionMethod"]) => {
    const newPreferences: UserLanguagePreferences = {
      primaryLanguage: newLanguage,
      fallbackLanguages: detectionResult?.fallbackChain || [],
      lastUsed: new Date().toISOString(),
      detectionMethod: method,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    
    saveUserLanguagePreferences(newPreferences);
    setPreferences(newPreferences);
  }, [detectionResult]);

  const loadSavedPreferences = useCallback(() => {
    const saved = loadUserLanguagePreferences();
    setPreferences(saved);
    return saved;
  }, []);

  const suggestAlternativeLanguages = useCallback(() => {
    return suggestLanguageForUser(
      language,
      navigator.userAgent,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }, [language]);

  useEffect(() => {
    loadSavedPreferences();
  }, [loadSavedPreferences]);

  return {
    detectionResult,
    preferences,
    detectOptimalLanguage,
    saveLanguagePreference,
    loadSavedPreferences,
    suggestAlternativeLanguages,
  };
}

/**
 * Cultural formatting hook
 */
export function useCulturalFormatting() {
  const { language } = useI18n();

  const formatAddressLocalized = useCallback(
    (address: Address, options?: { multiline?: boolean; includeCountry?: boolean }) => {
      return formatAddress(address, language, options);
    },
    [language]
  );

  const formatPhoneLocalized = useCallback(
    (phoneNumber: string, options?: { includeCountryCode?: boolean; international?: boolean }) => {
      return formatPhoneNumber(phoneNumber, language, options);
    },
    [language]
  );

  const formatNameLocalized = useCallback(
    (name: { first?: string; middle?: string; last?: string; [key: string]: string | undefined }, 
     options?: { honorific?: string; formal?: boolean }) => {
      return formatName(name, language, options);
    },
    [language]
  );

  const getCulturalColorForSemantic = useCallback(
    (semantic: "primary" | "success" | "warning" | "danger") => {
      return getCulturalColor(semantic, language);
    },
    [language]
  );

  const checkColorAppropriate = useCallback(
    (color: string, context: "general" | "celebration" | "mourning" = "general") => {
      return isColorCulturallyAppropriate(color, language, context);
    },
    [language]
  );

  return {
    formatAddress: formatAddressLocalized,
    formatPhone: formatPhoneLocalized,
    formatName: formatNameLocalized,
    getCulturalColor: getCulturalColorForSemantic,
    checkColorAppropriate,
  };
}

/**
 * Enhanced accessibility hook
 */
export function useI18nAccessibility() {
  const { language, setLanguage } = useI18n();
  const [previousLanguage, setPreviousLanguage] = useState<SupportedLanguage | undefined>();

  const announceLanguageChange = useCallback(
    (newLanguage: SupportedLanguage, immediate = false) => {
      const announcement = createLanguageChangeAnnouncement(newLanguage, previousLanguage);
      announceToScreenReader(announcement, immediate ? "assertive" : "polite", newLanguage);
      setPreviousLanguage(language);
    },
    [language, previousLanguage]
  );

  const setupKeyboardShortcuts = useCallback(
    (handlers: {
      languageSwitcher?: () => void;
      navigation?: Record<string, () => void>;
      textFormatting?: Record<string, () => void>;
    }) => {
      return registerKeyboardShortcuts(language, handlers);
    },
    [language]
  );

  const setupVoiceRecognition = useCallback(
    (options: {
      onResult?: (text: string) => void;
      onError?: (error: SpeechRecognitionErrorEvent) => void;
      continuous?: boolean;
      interimResults?: boolean;
    } = {}) => {
      return setupVoiceInput(language, options);
    },
    [language]
  );

  const setupDirectionManagement = useCallback(
    (container: HTMLElement) => {
      manageFocusForDirection(language, container);
    },
    [language]
  );

  const enhancedSetLanguage = useCallback(
    (newLanguage: SupportedLanguage, announce = true) => {
      setLanguage(newLanguage);
      if (announce) {
        announceLanguageChange(newLanguage);
      }
    },
    [setLanguage, announceLanguageChange]
  );

  return {
    announceLanguageChange,
    setupKeyboardShortcuts,
    setupVoiceRecognition,
    setupDirectionManagement,
    setLanguage: enhancedSetLanguage,
  };
}

/**
 * Performance optimization hook
 */
export function useI18nPerformance() {
  const { language } = useI18n();
  const [isInitialized, setIsInitialized] = useState(false);
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());

  const initializePerformanceFeatures = useCallback(async () => {
    try {
      await initializeI18nPerformance();
      setIsInitialized(true);
    } catch (error) {
      console.warn("Failed to initialize i18n performance features:", error);
    }
  }, []);

  const preloadPredictedLanguages = useCallback(async () => {
    await smartPreload(language);
  }, [language]);

  const preloadSpecificLanguages = useCallback(async (languages: SupportedLanguage[], namespaces?: string[]) => {
    await preloadLanguages(languages, namespaces);
  }, []);

  const recordLanguageUsage = useCallback((duration?: number) => {
    languageAnalytics.recordUsage(language, duration);
  }, [language]);

  const getPerformanceMetrics = useCallback(() => {
    const currentMetrics = performanceMonitor.getMetrics();
    setMetrics(currentMetrics);
    return currentMetrics;
  }, []);

  const getLanguageAnalytics = useCallback(() => {
    return languageAnalytics.getUsageStats();
  }, []);

  useEffect(() => {
    initializePerformanceFeatures();
  }, [initializePerformanceFeatures]);

  // Record language usage when language changes
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      recordLanguageUsage(duration);
    };
  }, [language, recordLanguageUsage]);

  // Preload predicted languages
  useEffect(() => {
    if (isInitialized) {
      preloadPredictedLanguages();
    }
  }, [language, isInitialized, preloadPredictedLanguages]);

  return {
    isInitialized,
    metrics,
    initializePerformanceFeatures,
    preloadPredictedLanguages,
    preloadSpecificLanguages,
    recordLanguageUsage,
    getPerformanceMetrics,
    getLanguageAnalytics,
  };
}

/**
 * Enhanced user preferences hook
 */
export function useUserLanguagePreferences() {
  const { language, setLanguage } = useI18n();
  const [preferences, setPreferences] = useState<UserLanguagePreferences | null>(null);
  const [suggestedLanguages, setSuggestedLanguages] = useState<SupportedLanguage[]>([]);

  const loadPreferences = useCallback(() => {
    const saved = loadUserLanguagePreferences();
    setPreferences(saved);
    
    if (saved && saved.primaryLanguage !== language) {
      // Ask user if they want to switch to their preferred language
      return saved;
    }
    
    return null;
  }, [language]);

  const savePreferences = useCallback((newPreferences: Partial<UserLanguagePreferences>) => {
    const current = preferences || {
      primaryLanguage: language,
      fallbackLanguages: [],
      lastUsed: new Date().toISOString(),
      detectionMethod: "manual" as const,
    };
    
    const updated = { ...current, ...newPreferences };
    saveUserLanguagePreferences(updated);
    setPreferences(updated);
  }, [preferences, language]);

  const updateLanguagePreference = useCallback((newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    savePreferences({
      primaryLanguage: newLanguage,
      lastUsed: new Date().toISOString(),
      detectionMethod: "manual",
    });
  }, [setLanguage, savePreferences]);

  const getSuggestions = useCallback(() => {
    const suggestions = suggestLanguageForUser(language);
    setSuggestedLanguages(suggestions);
    return suggestions;
  }, [language]);

  useEffect(() => {
    loadPreferences();
    getSuggestions();
  }, [loadPreferences, getSuggestions]);

  return {
    preferences,
    suggestedLanguages,
    loadPreferences,
    savePreferences,
    updateLanguagePreference,
    getSuggestions,
  };
}

/**
 * Combined enhanced i18n hook with all features
 */
export function useEnhancedI18n() {
  const baseI18n = useI18n();
  const detection = useLanguageDetection();
  const cultural = useCulturalFormatting();
  const accessibility = useI18nAccessibility();
  const performance = useI18nPerformance();
  const preferences = useUserLanguagePreferences();

  const enhancedFeatures = useMemo(() => ({
    // Language detection and preferences
    detection: {
      detectOptimalLanguage: detection.detectOptimalLanguage,
      suggestAlternativeLanguages: detection.suggestAlternativeLanguages,
      detectionResult: detection.detectionResult,
    },
    
    // Cultural formatting
    cultural: {
      formatAddress: cultural.formatAddress,
      formatPhone: cultural.formatPhone,
      formatName: cultural.formatName,
      getCulturalColor: cultural.getCulturalColor,
      checkColorAppropriate: cultural.checkColorAppropriate,
    },
    
    // Accessibility
    accessibility: {
      announceLanguageChange: accessibility.announceLanguageChange,
      setupKeyboardShortcuts: accessibility.setupKeyboardShortcuts,
      setupVoiceRecognition: accessibility.setupVoiceRecognition,
      setupDirectionManagement: accessibility.setupDirectionManagement,
    },
    
    // Performance
    performance: {
      isInitialized: performance.isInitialized,
      metrics: performance.metrics,
      preloadPredictedLanguages: performance.preloadPredictedLanguages,
      preloadSpecificLanguages: performance.preloadSpecificLanguages,
      getPerformanceMetrics: performance.getPerformanceMetrics,
      getLanguageAnalytics: performance.getLanguageAnalytics,
    },
    
    // User preferences
    preferences: {
      current: preferences.preferences,
      suggested: preferences.suggestedLanguages,
      update: preferences.updateLanguagePreference,
      save: preferences.savePreferences,
    },
  }), [detection, cultural, accessibility, performance, preferences]);

  return {
    ...baseI18n,
    enhanced: enhancedFeatures,
    // Override setLanguage with accessibility-aware version
    setLanguage: accessibility.setLanguage,
  };
}