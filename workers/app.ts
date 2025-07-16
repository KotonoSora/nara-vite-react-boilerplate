import { drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import apiRoute from "~/workers/api/common";
import landingPageRoute from "~/workers/api/features/landing-page";
import paymentRoute from "~/workers/api/features/payment";
import paymentWebhookRoute from "~/workers/api/features/payment-webhook";
import productsRoute from "~/workers/api/features/products";
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

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Routes
apiRoute.route("/landing-page", landingPageRoute);
apiRoute.route("/payment", paymentRoute);
apiRoute.route("/products", productsRoute);
appRoute.route("/webhooks/stripe", paymentWebhookRoute);
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
