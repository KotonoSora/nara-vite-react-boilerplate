import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { devOnlyMiddleware } from "~/workers/api/_shared/middleware/dev-only.middleware";

import { listShowcaseController } from "./list-showcase.controller";
import { listShowcaseValidator } from "./list-showcase.validator";

/**
 * Route: GET /list
 * Fetches list of showcases with filters and pagination.
 * Dev environment only.
 */
const listShowcaseRoute = new Hono<{ Bindings: Env }>();

listShowcaseRoute.use("*", devOnlyMiddleware);

listShowcaseRoute.get(
  "/",
  zValidator("query", listShowcaseValidator),
  listShowcaseController,
);

export default listShowcaseRoute;
