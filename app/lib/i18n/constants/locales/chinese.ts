// Import namespace files for Chinese
import zhAbout from "~/locales/zh/about.json";
import zhAdmin from "~/locales/zh/admin.json";
import zhAuth from "~/locales/zh/auth.json";
import zhCommon from "~/locales/zh/common.json";
import zhDashboard from "~/locales/zh/dashboard.json";
import zhErrors from "~/locales/zh/errors.json";
import zhLanding from "~/locales/zh/landing.json";
import zhLegal from "~/locales/zh/legal.json";
import zhNavigation from "~/locales/zh/navigation.json";
import zhShowcase from "~/locales/zh/showcase.json";
import zhTheme from "~/locales/zh/theme.json";
import zhTime from "~/locales/zh/time.json";

export const chineseTranslations = {
  ...zhCommon,
  navigation: zhNavigation,
  auth: zhAuth,
  admin: zhAdmin,
  dashboard: zhDashboard,
  errors: zhErrors,
  showcase: zhShowcase,
  time: zhTime,
  theme: zhTheme,
  landing: zhLanding,
  legal: zhLegal,
  about: zhAbout,
};
