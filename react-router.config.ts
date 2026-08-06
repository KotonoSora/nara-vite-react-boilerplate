import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  subResourceIntegrity: true,
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config;
