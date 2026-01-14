import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { devOnlyMiddleware } from "~/workers/api/_shared/middleware/dev-only.middleware";

import { createShowcaseController } from "./create-showcase.controller";
import { createShowcaseValidator } from "./create-showcase.validator";

/**
 * Route: POST /new
 * Creates a new showcase with tags.
 * Dev environment only.
 */
const createShowcaseRoute = new Hono<{ Bindings: Env }>();

createShowcaseRoute.use("*", devOnlyMiddleware);

createShowcaseRoute.post(
  "/",
  zValidator("json", createShowcaseValidator),
  createShowcaseController,
);

export default createShowcaseRoute;
