import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  subResourceIntegrity: true,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
    unstable_optimizeDeps: true,
  },
} satisfies Config;
