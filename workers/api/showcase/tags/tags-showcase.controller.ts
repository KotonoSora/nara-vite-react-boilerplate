import type { Context } from "hono";

import type { TagsShowcaseQuery } from "./tags-showcase.validator";

import { createDbInstance } from "~/workers/api/_shared/database/db.factory";
import { handleError } from "~/workers/api/_shared/errors/error.handler";

import { tagsShowcaseService } from "./tags-showcase.service";

/**
 * Controller for fetching showcase tags.
 * Orchestrates request handling without business logic.
 */
export const tagsShowcaseController = async (
  c: Context<{ Bindings: Env }, any, any>,
): Promise<Response> => {
  const query = c.req.valid("query") as TagsShowcaseQuery;
  const db = createDbInstance(c.env.DB);

  try {
    const result = await tagsShowcaseService(db, query);
    return c.json(result, 200);
  } catch (error) {
    return handleError(error, c, "Failed to fetch showcase tags");
  }
};
