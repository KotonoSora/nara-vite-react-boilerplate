import { drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";

import * as schema from "~/database/schema";

import apiRoute from "./api/common";
import appRoute from "./api/setup";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Routes
appRoute.route("/api", apiRoute);

appRoute.all("*", async (c) => {
  const request = c.req.raw; // Get the raw Request object
  const env = c.env; // Cloudflare environment
  const ctx = c.executionCtx; // Cloudflare execution context

  const db = drizzle(env.DB, { schema });

  const response = await requestHandler(request, {
    cloudflare: { env, ctx },
    db,
  });
  return response;
});

export default appRoute;
