import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createRequestHandler, RouterContextProvider } from "react-router";

import type { HonoBindings } from "~/workers/types";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import apiRoute from "~/workers/api/common";
import { HTTP_STATUS } from "~/workers/types";

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

// Init app with proper type bindings
const app = new Hono<HonoBindings>();

// Routes
app.route("/api", apiRoute);

// Not found handler with standardized response
app.notFound((c) =>
  c.json(
    {
      success: false,
      error: "Not Found",
      path: c.req.path,
    },
    HTTP_STATUS.NOT_FOUND,
  ),
);

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
