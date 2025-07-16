import { Hono } from "hono";
import type { Plugin } from "~/lib/plugins/types";
import { config } from "./plugin.config";

// Import existing showcase schema
import * as showcaseSchema from "~/database/schema/showcase";

const api = new Hono<{ Bindings: Env }>();

// Basic API routes for showcases
api.get("/", async (c) => {
  return c.json({ message: "Showcases API", plugin: config.name });
});

export const plugin: Plugin = {
  config,
  
  // Plugin routes configuration
  routes: {
    basePath: "/showcase",
    routes: [
      {
        path: "/",
        file: "routes/showcase._index.tsx"
      },
      {
        path: "/showcase",
        file: "routes/showcase.tsx"
      }
    ]
  },

  // Plugin API configuration
  api: {
    app: api,
    basePath: "/api/showcases"
  },

  // Plugin database schema
  database: {
    schema: showcaseSchema
  },

  // Plugin components
  components: {
    components: {
      // Showcase components would be exported here
      // For now, we reference the existing feature components
    }
  },

  // Plugin initialization
  async init(context) {
    console.log(`Initializing ${config.name} plugin v${config.version}`);
    
    // Verify that the landing-page plugin is available (dependency)
    const landingPagePlugin = context.registry.getPlugin("landing-page");
    if (!landingPagePlugin) {
      throw new Error("Showcases plugin requires landing-page plugin");
    }
    
    console.log("Showcases plugin dependency check passed");
  },

  // Plugin cleanup
  async destroy() {
    console.log(`Cleaning up ${config.name} plugin`);
  }
};

export default plugin;