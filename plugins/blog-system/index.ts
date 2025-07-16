import type { Plugin } from "~/lib/plugins/types";
import { config } from "./plugin.config";

export const plugin: Plugin = {
  config,
  
  // Plugin initialization
  async init(context) {
    console.log(`Initializing ${config.name} plugin v${config.version}`);
    
    // Add your initialization logic here
  },

  // Plugin cleanup
  async destroy() {
    console.log(`Cleaning up ${config.name} plugin`);
    
    // Add your cleanup logic here
  }
};

export default plugin;