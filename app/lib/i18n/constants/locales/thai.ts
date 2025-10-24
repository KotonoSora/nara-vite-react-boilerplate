// Import namespace files for Thai
import thAbout from "~/locales/th/about.json";
import thAdmin from "~/locales/th/admin.json";
import thAuth from "~/locales/th/auth.json";
import thCommon from "~/locales/th/common.json";
import thDashboard from "~/locales/th/dashboard.json";
import thErrors from "~/locales/th/errors.json";
import thLanding from "~/locales/th/landing.json";
import thLegal from "~/locales/th/legal.json";
import thNavigation from "~/locales/th/navigation.json";
import thShowcase from "~/locales/th/showcase.json";
import thTheme from "~/locales/th/theme.json";
import thTime from "~/locales/th/time.json";

export const thaiTranslations = {
  ...thCommon,
  navigation: thNavigation,
  auth: thAuth,
  admin: thAdmin,
  dashboard: thDashboard,
  errors: thErrors,
  showcase: thShowcase,
  time: thTime,
  theme: thTheme,
  landing: thLanding,
  legal: thLegal,
  about: thAbout,
};
