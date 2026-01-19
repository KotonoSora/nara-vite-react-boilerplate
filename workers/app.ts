import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createRequestHandler, RouterContextProvider } from "react-router";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

import { registerRoutes } from "./routes";

declare module "react-router" {
  export interface RouterContextProvider {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
  }
}

// Init app
const app = new Hono<{ Bindings: Env }>();

// Not found handler
app.notFound((c) => c.json({ error: "Not Found" }, 404));

// Add more routes here
registerRoutes(app);

// Main request handler
app.all("*", (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE,
  );

  const getLoadContext = (loadContext: {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
  }): RouterContextProvider => {
    let context = new RouterContextProvider();
    Object.assign(context, loadContext);
    return context;
  };

  const request = c.req.raw; // Get the raw Request object
  const env = c.env; // Cloudflare environment
  const ctx = c.executionCtx; // Cloudflare execution context

  const db = drizzle(env.DB, { schema });

  return requestHandler(
    request,
    getLoadContext({
      cloudflare: { env, ctx },
      db,
    }),
  );
});

export default app;
