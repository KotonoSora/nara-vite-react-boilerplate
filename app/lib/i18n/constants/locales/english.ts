// Import namespace files for English
import enAbout from "~/locales/en/about.json";
import enAdmin from "~/locales/en/admin.json";
import enAuth from "~/locales/en/auth.json";
import enCommon from "~/locales/en/common.json";
import enDashboard from "~/locales/en/dashboard.json";
import enErrors from "~/locales/en/errors.json";
import enLanding from "~/locales/en/landing.json";
import enLegal from "~/locales/en/legal.json";
import enNavigation from "~/locales/en/navigation.json";
import enShowcase from "~/locales/en/showcase.json";
import enTheme from "~/locales/en/theme.json";
import enTime from "~/locales/en/time.json";

export const englishTranslations = {
  ...enCommon,
  navigation: enNavigation,
  auth: enAuth,
  admin: enAdmin,
  dashboard: enDashboard,
  errors: enErrors,
  showcase: enShowcase,
  time: enTime,
  theme: enTheme,
  landing: enLanding,
  legal: enLegal,
  about: enAbout,
};
