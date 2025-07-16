import type { PluginConfig } from "~/lib/plugins/types";

export const config: PluginConfig = {
  id: "showcases",
  name: "Showcases",
  description: "Project showcase management with CRUD operations and tagging",
  version: "1.0.0",
  author: "KotonoSora",
  type: "feature",
  enabled: true,
  dependencies: ["landing-page"], // Depends on landing-page for showcase data
  entry: "./index.ts"
};

export default config;