/**
 * Internationalization-related type definitions
 * Centralized location for all i18n types used across the application
 */

// Import all translation files to generate types
import enAdmin from "~/locales/en/admin.json";
import enAuth from "~/locales/en/auth.json";
import enCommon from "~/locales/en/common.json";
import enDashboard from "~/locales/en/dashboard.json";
import enErrors from "~/locales/en/errors.json";
import enLanding from "~/locales/en/landing.json";
import enNavigation from "~/locales/en/navigation.json";
import enShowcase from "~/locales/en/showcase.json";
import enTheme from "~/locales/en/theme.json";
import enTime from "~/locales/en/time.json";

// Supported languages
export type SupportedLanguage = "en" | "ar" | "es" | "fr" | "hi" | "ja" | "th" | "vi" | "zh";

// Create the complete namespace translation structure
type NamespaceTranslations = typeof enCommon & {
  navigation: typeof enNavigation;
  auth: typeof enAuth;
  admin: typeof enAdmin;
  dashboard: typeof enDashboard;
  errors: typeof enErrors;
  showcase: typeof enShowcase;
  time: typeof enTime;
  theme: typeof enTheme;
  landing: typeof enLanding;
};

// Extract the shape of the translation object to create a recursive type
type TranslationValue = string | { [key: string]: TranslationValue };

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Generate all possible translation keys from the namespace translation structure
export type TranslationKey = NestedKeyOf<NamespaceTranslations>;

// Type for translation function return (always a string)
export type TranslationFunction = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

// Helper type to extract nested object values
export type NestedTranslationObject = NamespaceTranslations;

// i18n context value
export interface I18nContextValue {
  language: SupportedLanguage;
  t: TranslationFunction;
  isLoading: boolean;
}

// i18n provider props
export interface I18nProviderProps {
  children: React.ReactNode;
  language: SupportedLanguage;
  translations: NestedTranslationObject;
}

// Language detection result
export interface LanguageDetectionResult {
  language: SupportedLanguage;
  translations: NestedTranslationObject;
  t: TranslationFunction;
}

// Translation loading state
export interface TranslationLoadingState {
  isLoading: boolean;
  language: SupportedLanguage;
  translations: NestedTranslationObject | null;
  error: string | null;
}