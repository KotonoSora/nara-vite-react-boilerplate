import { drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import apiRoute from "~/workers/api/common";
import landingPageRoute from "~/workers/api/features/landing-page";
import appRoute from "~/workers/api/setup";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
  }
}

// Plugin system integration (lazy-loaded to avoid build-time issues)
let pluginsInitialized = false;
let pluginSystem: any = null;

async function initializePluginSystemIfNeeded(env: any) {
  if (!pluginsInitialized && import.meta.env.DEV) {
    try {
      // Dynamically import plugin system to avoid build-time dependencies
      pluginSystem = await import("~/lib/plugins");
      
      await pluginSystem.initializePluginSystem({
        db: undefined, // Will be set per request
        env,
        registry: pluginSystem.pluginRegistry
      });
      
      // Register plugin APIs
      pluginSystem.registerPluginAPIs(apiRoute);
      
      pluginsInitialized = true;
      console.log("Plugin system initialized successfully");
    } catch (error) {
      console.error("Failed to initialize plugins:", error);
    }
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Routes
apiRoute.route("/landing-page", landingPageRoute);
appRoute.route("/api", apiRoute);

appRoute.all("*", async (c) => {
  // Initialize plugins on first request (in development)
  await initializePluginSystemIfNeeded(c.env);

  const request = c.req.raw; // Get the raw Request object
  const env = c.env; // Cloudflare environment
  const ctx = c.executionCtx; // Cloudflare execution context

  // Merge base schema with plugin schemas if available
  let combinedSchema = schema;
  if (pluginSystem) {
    try {
      const pluginSchemas = pluginSystem.collectPluginSchemas();
      combinedSchema = { ...schema, ...pluginSchemas };
    } catch (error) {
      console.warn("Failed to collect plugin schemas:", error);
    }
  }
  
  const db = drizzle(env.DB, { schema: combinedSchema });

  const response = await requestHandler(request, {
    cloudflare: { env, ctx },
    db,
  });
  return response;
});

export default appRoute;
