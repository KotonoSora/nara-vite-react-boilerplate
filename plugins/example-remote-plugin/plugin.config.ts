import type { PluginConfig } from "~/lib/plugins/types";

export const config: PluginConfig = {
  id: "example-remote-plugin",
  name: "Example Remote Plugin",
  description: "Description for Example Remote Plugin",
  version: "1.0.0",
  author: "Your Name",
  type: "feature",
  enabled: true,
  dependencies: [],
  entry: "./index.ts"
};

export default config;