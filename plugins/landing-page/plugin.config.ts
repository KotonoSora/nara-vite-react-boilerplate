import type { PluginConfig } from "~/lib/plugins/types";

export const config: PluginConfig = {
  id: "landing-page",
  name: "Landing Page",
  description: "Beautiful landing page with hero section, features, and tech stack showcase",
  version: "1.0.0",
  author: "KotonoSora",
  type: "feature",
  enabled: true,
  dependencies: [],
  entry: "./index.ts"
};

export default config;