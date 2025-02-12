import { index, route } from "@react-router/dev/routes";

import type { RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "dashboard/page.tsx"),
  route("login", "login/page.tsx"),
] satisfies RouteConfig;
