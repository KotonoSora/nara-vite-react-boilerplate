// Import namespace files for Hindi
import hiAbout from "./about.json";
import hiAdmin from "./admin.json";
import hiAuth from "./auth.json";
import hiBlog from "./blog.json";
import hiCalendar from "./calendar.json";
import hiCommon from "./common.json";
import hiDashboard from "./dashboard.json";
import hiErrors from "./errors.json";
import hiForest from "./forest.json";
import hiLanding from "./landing.json";
import hiLegal from "./legal.json";
import hiNavigation from "./navigation.json";
import hiQrGenerator from "./qr-generator.json";
import hiShowcase from "./showcase.json";
import hiTheme from "./theme.json";
import hiTime from "./time.json";

export const hindiTranslations = {
  ...hiCommon,
  about: hiAbout,
  admin: hiAdmin,
  auth: hiAuth,
  blog: hiBlog,
  calendar: hiCalendar,
  dashboard: hiDashboard,
  errors: hiErrors,
  forest: hiForest,
  landing: hiLanding,
  legal: hiLegal,
  navigation: hiNavigation,
  qrGenerator: hiQrGenerator,
  showcase: hiShowcase,
  theme: hiTheme,
  time: hiTime,
};
