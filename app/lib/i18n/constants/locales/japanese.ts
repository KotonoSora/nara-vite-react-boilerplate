// Import namespace files for Japanese
import jaAbout from "~/locales/ja/about.json";
import jaAdmin from "~/locales/ja/admin.json";
import jaAuth from "~/locales/ja/auth.json";
import jaCommon from "~/locales/ja/common.json";
import jaDashboard from "~/locales/ja/dashboard.json";
import jaErrors from "~/locales/ja/errors.json";
import jaLanding from "~/locales/ja/landing.json";
import jaLegal from "~/locales/ja/legal.json";
import jaNavigation from "~/locales/ja/navigation.json";
import jaShowcase from "~/locales/ja/showcase.json";
import jaTheme from "~/locales/ja/theme.json";
import jaTime from "~/locales/ja/time.json";

export const japaneseTranslations = {
  ...jaCommon,
  navigation: jaNavigation,
  auth: jaAuth,
  admin: jaAdmin,
  dashboard: jaDashboard,
  errors: jaErrors,
  showcase: jaShowcase,
  time: jaTime,
  theme: jaTheme,
  landing: jaLanding,
  legal: jaLegal,
  about: jaAbout,
};
