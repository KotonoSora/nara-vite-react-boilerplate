// Import namespace files for Arabic
import arAbout from "~/locales/ar/about.json";
import arAdmin from "~/locales/ar/admin.json";
import arAuth from "~/locales/ar/auth.json";
import arCommon from "~/locales/ar/common.json";
import arDashboard from "~/locales/ar/dashboard.json";
import arErrors from "~/locales/ar/errors.json";
import arLanding from "~/locales/ar/landing.json";
import arLegal from "~/locales/ar/legal.json";
import arNavigation from "~/locales/ar/navigation.json";
import arShowcase from "~/locales/ar/showcase.json";
import arTheme from "~/locales/ar/theme.json";
import arTime from "~/locales/ar/time.json";

export const arabicTranslations = {
  ...arCommon,
  navigation: arNavigation,
  auth: arAuth,
  admin: arAdmin,
  dashboard: arDashboard,
  errors: arErrors,
  showcase: arShowcase,
  time: arTime,
  theme: arTheme,
  landing: arLanding,
  legal: arLegal,
  about: arAbout,
};
