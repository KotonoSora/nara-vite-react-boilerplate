// Import namespace files for Hindi
import hiAbout from "~/locales/hi/about.json";
import hiAdmin from "~/locales/hi/admin.json";
import hiAuth from "~/locales/hi/auth.json";
import hiCommon from "~/locales/hi/common.json";
import hiDashboard from "~/locales/hi/dashboard.json";
import hiErrors from "~/locales/hi/errors.json";
import hiLanding from "~/locales/hi/landing.json";
import hiLegal from "~/locales/hi/legal.json";
import hiNavigation from "~/locales/hi/navigation.json";
import hiShowcase from "~/locales/hi/showcase.json";
import hiTheme from "~/locales/hi/theme.json";
import hiTime from "~/locales/hi/time.json";

export const hindiTranslations = {
  ...hiCommon,
  navigation: hiNavigation,
  auth: hiAuth,
  admin: hiAdmin,
  dashboard: hiDashboard,
  errors: hiErrors,
  showcase: hiShowcase,
  time: hiTime,
  theme: hiTheme,
  landing: hiLanding,
  legal: hiLegal,
  about: hiAbout,
};
