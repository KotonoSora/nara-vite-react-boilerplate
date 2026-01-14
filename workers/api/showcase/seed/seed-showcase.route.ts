import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { devOnlyMiddleware } from "~/workers/api/_shared/middleware/dev-only.middleware";

import { seedShowcaseController } from "./seed-showcase.controller";
import { seedShowcaseValidator } from "./seed-showcase.validator";

/**
 * Route: POST /seed
 * Seeds showcases into the database.
 * Dev environment only.
 */
const seedShowcaseRoute = new Hono<{ Bindings: Env }>();

seedShowcaseRoute.use("*", devOnlyMiddleware);

seedShowcaseRoute.post(
  "/",
  zValidator("json", seedShowcaseValidator),
  seedShowcaseController,
);

export default seedShowcaseRoute;
