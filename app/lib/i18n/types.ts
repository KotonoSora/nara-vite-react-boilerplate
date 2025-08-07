// Import all translation files to generate types
import enAdmin from "~/locales/en/admin.json";
import enAuth from "~/locales/en/auth.json";
import enCommon from "~/locales/en/common.json";
import enDashboard from "~/locales/en/dashboard.json";
import enErrors from "~/locales/en/errors.json";
import enLanding from "~/locales/en/landing.json";
import enNavigation from "~/locales/en/navigation.json";
import enRoadmap from "~/locales/en/roadmap.json";
import enShowcase from "~/locales/en/showcase.json";
import enTheme from "~/locales/en/theme.json";
import enTime from "~/locales/en/time.json";

// Create the complete namespace translation structure
type NamespaceTranslations = typeof enCommon & {
  navigation: typeof enNavigation;
  auth: typeof enAuth;
  admin: typeof enAdmin;
  dashboard: typeof enDashboard;
  errors: typeof enErrors;
  showcase: typeof enShowcase;
  roadmap: typeof enRoadmap;
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
