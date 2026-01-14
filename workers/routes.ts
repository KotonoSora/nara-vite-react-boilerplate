import { cors } from "hono/cors";
import { logger } from "hono/logger";

import type { Hono } from "hono";

import createShowcaseRoute from "./api/showcase/create/create-showcase.route";
import listShowcaseRoute from "./api/showcase/list/list-showcase.route";
import seedShowcaseRoute from "./api/showcase/seed/seed-showcase.route";
import tagsShowcaseRoute from "./api/showcase/tags/tags-showcase.route";

/**
 * Centralized route registration.
 * Mounts all API routes onto the main Hono app.
 */
export const registerRoutes = (app: Hono<{ Bindings: Env }>) => {
  app.use("*", logger());
  app.use("*", cors());

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.route("/api/dev/showcases/seed", seedShowcaseRoute);
  app.route("/api/dev/showcases/list", listShowcaseRoute);
  app.route("/api/dev/showcases/tags", tagsShowcaseRoute);
  app.route("/api/dev/showcases/new", createShowcaseRoute);
};
