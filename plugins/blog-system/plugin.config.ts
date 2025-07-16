import type { PluginConfig } from "~/lib/plugins/types";

export const config: PluginConfig = {
  id: "blog-system",
  name: "Blog System",
  description: "Description for Blog System",
  version: "1.0.0",
  author: "Your Name",
  type: "feature",
  enabled: true,
  dependencies: [],
  entry: "./index.ts"
};

export default config;