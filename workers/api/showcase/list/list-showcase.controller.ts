import type { Context } from "hono";

import type { ListShowcaseQuery } from "./list-showcase.validator";

import { createDbInstance } from "~/workers/api/_shared/database/db.factory";
import { handleError } from "~/workers/api/_shared/errors/error.handler";

import { listShowcaseService } from "./list-showcase.service";

/**
 * Controller for listing showcases.
 * Orchestrates request handling without business logic.
 */
export const listShowcaseController = async (
  c: Context<{ Bindings: Env }, any, any>,
): Promise<Response> => {
  const query = c.req.valid("query") as ListShowcaseQuery;
  const db = createDbInstance(c.env.DB);

  try {
    const result = await listShowcaseService(db, query);
    return c.json(result, 200);
  } catch (error) {
    return handleError(error, c, "Failed to fetch showcases");
  }
};
