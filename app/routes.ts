import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Get base routes from file system
const baseRoutes = flatRoutes();

// Plugin routes will be integrated at runtime, not build time
// This keeps the build process simple and fast
export default baseRoutes satisfies RouteConfig;
