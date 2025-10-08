import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createRequestHandler, RouterContextProvider } from "react-router";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

declare module "react-router" {
  export interface RouterContextProvider {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Init app
const app = new Hono<{ Bindings: Env }>();

// Not found handler
app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.all("*", async (c) => {
  const request = c.req.raw; // Get the raw Request object
  const env = c.env; // Cloudflare environment
  const ctx = c.executionCtx; // Cloudflare execution context

  const db = drizzle(env.DB, { schema });

  const context = new RouterContextProvider();
  const response = await requestHandler(
    request,
    Object.assign(context, {
      cloudflare: { env, ctx },
      db,
    }),
  );
  return response;
});

export default app;
