import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  prerender: [
    "/about",
    "/chart",
    "/calendar",
    "/terms",
    "/privacy",
    "/blog",
    "/blog/*",
  ],
  future: {
    v8_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_subResourceIntegrity: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
