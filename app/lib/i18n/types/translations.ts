// Import all translation files to generate types
import type enAbout from "~/locales/en/about.json";
import type enAdmin from "~/locales/en/admin.json";
import type enAuth from "~/locales/en/auth.json";
import type enBlog from "~/locales/en/blog.json";
import type enCalendar from "~/locales/en/calendar.json";
import type enCommon from "~/locales/en/common.json";
import type enDashboard from "~/locales/en/dashboard.json";
import type enErrors from "~/locales/en/errors.json";
import type enForest from "~/locales/en/forest.json";
import type enLanding from "~/locales/en/landing.json";
import type enLegal from "~/locales/en/legal.json";
import type enNavigation from "~/locales/en/navigation.json";
import type enQrGenerator from "~/locales/en/qr-generator.json";
import type enShowcase from "~/locales/en/showcase.json";
import type enTheme from "~/locales/en/theme.json";
import type enTime from "~/locales/en/time.json";

// Create the complete namespace translation structure
type NamespaceTranslations = typeof enCommon & {
  about: typeof enAbout;
  admin: typeof enAdmin;
  auth: typeof enAuth;
  blog: typeof enBlog;
  calendar: typeof enCalendar;
  dashboard: typeof enDashboard;
  errors: typeof enErrors;
  forest: typeof enForest;
  landing: typeof enLanding;
  legal: typeof enLegal;
  navigation: typeof enNavigation;
  qrGenerator: typeof enQrGenerator;
  showcase: typeof enShowcase;
  theme: typeof enTheme;
  time: typeof enTime;
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
