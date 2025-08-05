// Explicit exports for better tree-shaking
export { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  LANGUAGE_NAMES, 
  RTL_LANGUAGES,
  isRTLLanguage,
  isSupportedLanguage,
  getLanguageFromPath,
  removeLanguageFromPath,
  addLanguageToPath,
  detectLanguageFromAcceptLanguage 
} from "./config";

export type { SupportedLanguage } from "./config";

export type { 
  NestedTranslationObject, 
  TranslationKey, 
  TranslationFunction 
} from "./types";

export { 
  getTranslation, 
  getTranslationAsync,
  createTranslationFunction,
  createTranslationFunctionAsync,
  preloadTranslations,
  areTranslationsLoaded 
} from "./translations";

export { I18nContext, useI18n, useTranslation, useLanguage } from "./context";
export type { I18nContextValue } from "./context";

export { I18nProvider } from "./provider";
