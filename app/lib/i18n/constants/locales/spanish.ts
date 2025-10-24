// Import namespace files for Spanish
import esAbout from "~/locales/es/about.json";
import esAdmin from "~/locales/es/admin.json";
import esAuth from "~/locales/es/auth.json";
import esCommon from "~/locales/es/common.json";
import esDashboard from "~/locales/es/dashboard.json";
import esErrors from "~/locales/es/errors.json";
import esLanding from "~/locales/es/landing.json";
import esLegal from "~/locales/es/legal.json";
import esNavigation from "~/locales/es/navigation.json";
import esShowcase from "~/locales/es/showcase.json";
import esTheme from "~/locales/es/theme.json";
import esTime from "~/locales/es/time.json";

export const spanishTranslations = {
  ...esCommon,
  navigation: esNavigation,
  auth: esAuth,
  admin: esAdmin,
  dashboard: esDashboard,
  errors: esErrors,
  showcase: esShowcase,
  time: esTime,
  theme: esTheme,
  landing: esLanding,
  legal: esLegal,
  about: esAbout,
};
