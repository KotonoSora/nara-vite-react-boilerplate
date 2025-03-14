import { index, route } from "@react-router/dev/routes";

import type { RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("welcome", "routes/welcome.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
