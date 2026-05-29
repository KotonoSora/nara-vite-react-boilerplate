import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createRequestHandler, RouterContextProvider } from "react-router";

import type { BasicAuthBindings } from "./middleware/dev-domain-basic-auth";

import * as schema from "~/database/schema";
import { CloudflareContext, DatabaseContext } from "~/lib/context/server";

import { devDomainBasicAuthMiddleware } from "./middleware/dev-domain-basic-auth";
import { registerRoutes } from "./routes";

// Init app
const app = new Hono<{ Bindings: Env & BasicAuthBindings }>();

app.use("*", devDomainBasicAuthMiddleware);

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

  const request = c.req.raw; // Get the raw Request object
  const env = c.env; // Cloudflare environment
  const ctx = c.executionCtx; // Cloudflare execution context

  const db = drizzle(env.DB, { schema });
  const context = new RouterContextProvider();
  context.set(CloudflareContext, { env, ctx });
  context.set(DatabaseContext, db);

  return requestHandler(request, context);
});

export default app;
