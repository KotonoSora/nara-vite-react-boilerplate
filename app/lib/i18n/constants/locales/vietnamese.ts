// Import namespace files for Vietnamese
import viAbout from "~/locales/vi/about.json";
import viAdmin from "~/locales/vi/admin.json";
import viAuth from "~/locales/vi/auth.json";
import viCommon from "~/locales/vi/common.json";
import viDashboard from "~/locales/vi/dashboard.json";
import viErrors from "~/locales/vi/errors.json";
import viLanding from "~/locales/vi/landing.json";
import viLegal from "~/locales/vi/legal.json";
import viNavigation from "~/locales/vi/navigation.json";
import viShowcase from "~/locales/vi/showcase.json";
import viTheme from "~/locales/vi/theme.json";
import viTime from "~/locales/vi/time.json";

export const vietnameseTranslations = {
  ...viCommon,
  navigation: viNavigation,
  auth: viAuth,
  admin: viAdmin,
  dashboard: viDashboard,
  errors: viErrors,
  showcase: viShowcase,
  time: viTime,
  theme: viTheme,
  landing: viLanding,
  legal: viLegal,
  about: viAbout,
};
