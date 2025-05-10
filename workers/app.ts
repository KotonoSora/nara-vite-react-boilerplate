import { getLoadContext } from "load-context";
import { createRequestHandler } from "react-router";

import { api, app, book, posts } from "./api";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Routes
api.route("/posts", posts);
api.route("/book", book);
app.route("/api", api);

app.all("*", async (c) => {
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

export default app;
