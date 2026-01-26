import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: false,
      provider: "istanbul",
      include: ["app", "packages/**/src", "workers/api"],
      exclude: ["**/*.json"],
    },
  },
});
