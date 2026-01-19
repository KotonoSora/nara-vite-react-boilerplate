// Import namespace files for Thai
import thAbout from "./about.json";
import thAdmin from "./admin.json";
import thAuth from "./auth.json";
import thBlog from "./blog.json";
import thCalendar from "./calendar.json";
import thCommon from "./common.json";
import thDashboard from "./dashboard.json";
import thErrors from "./errors.json";
import thForest from "./forest.json";
import thLanding from "./landing.json";
import thLegal from "./legal.json";
import thNavigation from "./navigation.json";
import thQrGenerator from "./qr-generator.json";
import thShowcase from "./showcase.json";
import thTheme from "./theme.json";
import thTime from "./time.json";

export const thaiTranslations = {
  ...thCommon,
  about: thAbout,
  admin: thAdmin,
  auth: thAuth,
  blog: thBlog,
  calendar: thCalendar,
  dashboard: thDashboard,
  errors: thErrors,
  forest: thForest,
  landing: thLanding,
  legal: thLegal,
  navigation: thNavigation,
  qrGenerator: thQrGenerator,
  showcase: thShowcase,
  theme: thTheme,
  time: thTime,
};
