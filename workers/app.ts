import { getLoadContext } from "load-context";
import { createRequestHandler } from "react-router";

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

  const loadContext = getLoadContext({
    request,
    context: { cloudflare: { env, ctx } },
  });

  const response = await requestHandler(request, loadContext);
  return response;
});

export default appRoute;
