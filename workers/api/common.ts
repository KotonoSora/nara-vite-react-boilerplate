import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import auth from "~/workers/api/features/auth";
import landingPageRoute from "~/workers/api/features/landing-page";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger()); // Request logging
app.use("*", cors({ origin: "*" })); // CORS for all origins (restrict in production)
app.use("*", prettyJSON()); // Pretty-print JSON responses

// Add security headers to all responses
app.use("*", async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("Content-Security-Policy", "default-src 'self'");
});

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error("Unexpected error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// Routes
app.get("/", (c) => {
  const env = import.meta.env;
  return c.json({ message: `Hello from Hono! Running in API`, env });
});

app.get("/hello-world", (c) => c.json({ message: "Hello, World!" }));

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/landing-page", landingPageRoute);
app.route("/auth", auth);

// Example route to test error handling
if (import.meta.env.NODE_ENV === "development") {
  app.get("/error", () => {
    throw new HTTPException(400, { message: "This is a test error" });
  });
}

// Throw not found response
app.all("*", async (c) => c.notFound());

export default app;
