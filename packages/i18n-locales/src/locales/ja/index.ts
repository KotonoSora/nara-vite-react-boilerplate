// Import namespace files for Japanese
import jaAbout from "./about.json";
import jaAdmin from "./admin.json";
import jaAuth from "./auth.json";
import jaBlog from "./blog.json";
import jaCalendar from "./calendar.json";
import jaCommon from "./common.json";
import jaDashboard from "./dashboard.json";
import jaErrors from "./errors.json";
import jaForest from "./forest.json";
import jaLanding from "./landing.json";
import jaLegal from "./legal.json";
import jaNavigation from "./navigation.json";
import jaQrGenerator from "./qr-generator.json";
import jaShowcase from "./showcase.json";
import jaTheme from "./theme.json";
import jaTime from "./time.json";

export const japaneseTranslations = {
  ...jaCommon,
  about: jaAbout,
  admin: jaAdmin,
  auth: jaAuth,
  blog: jaBlog,
  calendar: jaCalendar,
  dashboard: jaDashboard,
  errors: jaErrors,
  forest: jaForest,
  landing: jaLanding,
  legal: jaLegal,
  navigation: jaNavigation,
  qrGenerator: jaQrGenerator,
  showcase: jaShowcase,
  theme: jaTheme,
  time: jaTime,
};
