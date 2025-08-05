import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import landingPageRoute from "~/workers/api/features/landing-page";

const app = new Hono<{ Bindings: Env }>();

// Conditional middleware based on environment
const isDevelopment = import.meta.env.NODE_ENV === "development" || import.meta.env.NODE_ENV === "vitest";
const isProduction = import.meta.env.NODE_ENV === "production";

// Request logging - only in development or when explicitly enabled
if (isDevelopment || import.meta.env.ENABLE_LOGGING === "true") {
  app.use("*", logger());
}

// CORS - more restrictive in production
app.use("*", cors({ 
  origin: isProduction ? 
    ["https://your-domain.com", "https://www.your-domain.com"] : // Replace with actual domains
    "*" 
}));

// Pretty JSON - only in development for debugging
if (isDevelopment) {
  app.use("*", prettyJSON());
}

// Security headers - optimized for production
app.use("*", async (c, next) => {
  await next();
  
  // Basic security headers
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  
  // More restrictive CSP in production
  const csp = isProduction 
    ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
    : "default-src 'self'";
  c.res.headers.set("Content-Security-Policy", csp);
  
  // Additional security headers in production
  if (isProduction) {
    c.res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    c.res.headers.set("X-XSS-Protection", "1; mode=block");
    c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }
});

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  
  // Log errors in development, but avoid exposing details in production
  if (isDevelopment) {
    console.error("Unexpected error:", err);
    return c.json({ 
      error: "Internal Server Error", 
      details: err.message,
      stack: err.stack 
    }, 500);
  } else {
    // In production, log error but don't expose details
    console.error("Production error:", err.message);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Routes
app.get("/", (c) => {
  const env = isDevelopment ? import.meta.env : undefined;
  return c.json({ 
    message: `Hello from Hono! Running in API`, 
    ...(env && { env }) // Only include env in development
  });
});

app.get("/hello-world", (c) => c.json({ message: "Hello, World!" }));

app.get("/health", (c) => c.json({ 
  status: "ok", 
  timestamp: new Date().toISOString(),
  environment: isProduction ? "production" : "development"
}));

app.route("/landing-page", landingPageRoute);

// Example route to test error handling - only in development
if (isDevelopment) {
  app.get("/error", () => {
    throw new HTTPException(400, { message: "This is a test error" });
  });
}

// Throw not found response
app.all("*", async (c) => c.notFound());

export default app;
