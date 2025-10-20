// Import all translation files to generate types
import type enAbout from "~/locales/en/about.json";
import type enAdmin from "~/locales/en/admin.json";
import type enAuth from "~/locales/en/auth.json";
import type enCommon from "~/locales/en/common.json";
import type enDashboard from "~/locales/en/dashboard.json";
import type enErrors from "~/locales/en/errors.json";
import type enLanding from "~/locales/en/landing.json";
import type enLegal from "~/locales/en/legal.json";
import type enNavigation from "~/locales/en/navigation.json";
import type enShowcase from "~/locales/en/showcase.json";
import type enTheme from "~/locales/en/theme.json";
import type enTime from "~/locales/en/time.json";

import type { createTranslationFunction } from "../utils/translations/create-translation-function";

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
  legal: typeof enLegal;
  about: typeof enAbout;
};

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

export type TranslationFunctionType = ReturnType<
  typeof createTranslationFunction
>;
