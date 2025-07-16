import { Hono } from "hono";
import type { Plugin } from "~/lib/plugins/types";
import { config } from "./plugin.config";

// Import existing landing page API
import landingPageAPI from "~/workers/api/features/landing-page";

// Import landing page components (we'll reference the existing ones)
// In a real plugin, these would be copied to the plugin directory

const api = new Hono<{ Bindings: Env }>();

// Mount the existing landing page API
api.route("/", landingPageAPI);

export const plugin: Plugin = {
  config,
  
  // Plugin routes configuration
  routes: {
    basePath: "",
    routes: [
      {
        path: "/",
        file: "routes/_index.tsx"
      }
    ]
  },

  // Plugin API configuration
  api: {
    app: api,
    basePath: "/api/landing-page"
  },

  // Plugin database schema (uses existing showcase schema)
  database: {
    schema: {
      // Reference to existing showcase schema
      // In a real plugin, this would be defined here
    }
  },

  // Plugin components
  components: {
    components: {
      // Landing page components would be exported here
      // For now, we reference the existing feature components
    }
  },

  // Plugin initialization
  async init(context) {
    console.log(`Initializing ${config.name} plugin v${config.version}`);
    
    // Any plugin-specific initialization logic would go here
    // For example: setting up event listeners, configuring services, etc.
  },

  // Plugin cleanup
  async destroy() {
    console.log(`Cleaning up ${config.name} plugin`);
    
    // Any plugin-specific cleanup logic would go here
  }
};

export default plugin;