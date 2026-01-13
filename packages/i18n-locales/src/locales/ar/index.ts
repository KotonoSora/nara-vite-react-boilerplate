// Import namespace files for Arabic
import arAbout from "./about.json";
import arAdmin from "./admin.json";
import arAuth from "./auth.json";
import arBlog from "./blog.json";
import arCalendar from "./calendar.json";
import arCommon from "./common.json";
import arDashboard from "./dashboard.json";
import arErrors from "./errors.json";
import arForest from "./forest.json";
import arLanding from "./landing.json";
import arLegal from "./legal.json";
import arNavigation from "./navigation.json";
import arQrGenerator from "./qr-generator.json";
import arShowcase from "./showcase.json";
import arTheme from "./theme.json";
import arTime from "./time.json";

export const arabicTranslations = {
  ...arCommon,
  about: arAbout,
  admin: arAdmin,
  auth: arAuth,
  blog: arBlog,
  calendar: arCalendar,
  dashboard: arDashboard,
  errors: arErrors,
  forest: arForest,
  landing: arLanding,
  legal: arLegal,
  navigation: arNavigation,
  qrGenerator: arQrGenerator,
  showcase: arShowcase,
  theme: arTheme,
  time: arTime,
};
