// Import namespace files for Spanish
import esAbout from "./about.json";
import esAdmin from "./admin.json";
import esAuth from "./auth.json";
import esBlog from "./blog.json";
import esCalendar from "./calendar.json";
import esCommon from "./common.json";
import esDashboard from "./dashboard.json";
import esErrors from "./errors.json";
import esForest from "./forest.json";
import esLanding from "./landing.json";
import esLegal from "./legal.json";
import esNavigation from "./navigation.json";
import esQrGenerator from "./qr-generator.json";
import esShowcase from "./showcase.json";
import esTheme from "./theme.json";
import esTime from "./time.json";

export const spanishTranslations = {
  ...esCommon,
  about: esAbout,
  admin: esAdmin,
  auth: esAuth,
  blog: esBlog,
  calendar: esCalendar,
  dashboard: esDashboard,
  errors: esErrors,
  forest: esForest,
  landing: esLanding,
  legal: esLegal,
  navigation: esNavigation,
  qrGenerator: esQrGenerator,
  showcase: esShowcase,
  theme: esTheme,
  time: esTime,
};
