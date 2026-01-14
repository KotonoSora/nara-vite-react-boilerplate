import { Hono } from "hono";

import { devOnlyMiddleware } from "~/workers/api/_shared/middleware/dev-only.middleware";
import { zValidator } from "~/workers/api/_shared/middleware/validators/zod.validator";

import { tagsShowcaseController } from "./tags-showcase.controller";
import { tagsShowcaseValidator } from "./tags-showcase.validator";

/**
 * Route: GET /tags
 * Fetches list of showcase tags with counts.
 * Dev environment only.
 */
const tagsShowcaseRoute = new Hono<{ Bindings: Env }>();

tagsShowcaseRoute.use("*", devOnlyMiddleware);

tagsShowcaseRoute.get(
  "/",
  zValidator("query", tagsShowcaseValidator),
  tagsShowcaseController,
);

export default tagsShowcaseRoute;
