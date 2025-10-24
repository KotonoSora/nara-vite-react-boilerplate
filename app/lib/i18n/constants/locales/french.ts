// Import namespace files for French
import frAbout from "~/locales/fr/about.json";
import frAdmin from "~/locales/fr/admin.json";
import frAuth from "~/locales/fr/auth.json";
import frCommon from "~/locales/fr/common.json";
import frDashboard from "~/locales/fr/dashboard.json";
import frErrors from "~/locales/fr/errors.json";
import frLanding from "~/locales/fr/landing.json";
import frLegal from "~/locales/fr/legal.json";
import frNavigation from "~/locales/fr/navigation.json";
import frShowcase from "~/locales/fr/showcase.json";
import frTheme from "~/locales/fr/theme.json";
import frTime from "~/locales/fr/time.json";

export const frenchTranslations = {
  ...frCommon,
  navigation: frNavigation,
  auth: frAuth,
  admin: frAdmin,
  dashboard: frDashboard,
  errors: frErrors,
  showcase: frShowcase,
  time: frTime,
  theme: frTheme,
  landing: frLanding,
  legal: frLegal,
  about: frAbout,
};
