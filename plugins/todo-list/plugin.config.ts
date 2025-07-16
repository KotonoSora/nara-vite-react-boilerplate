import type { PluginConfig } from "~/lib/plugins/types";

export const config: PluginConfig = {
  id: "todo-list",
  name: "Todo List",
  description: "Description for Todo List",
  version: "1.0.0",
  author: "Your Name",
  type: "feature",
  enabled: true,
  dependencies: [],
  entry: "./index.ts"
};

export default config;