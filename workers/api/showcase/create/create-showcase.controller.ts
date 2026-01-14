import type { Context } from "hono";

import type { CreateShowcaseInput } from "./create-showcase.validator";

import { createDbInstance } from "~/workers/api/_shared/database/db.factory";
import { handleError } from "~/workers/api/_shared/errors/error.handler";

import { createShowcaseService } from "./create-showcase.service";

/**
 * Controller for creating a new showcase.
 * Orchestrates request handling without business logic.
 */
export const createShowcaseController = async (
  c: Context<{ Bindings: Env }, any, any>,
): Promise<Response> => {
  const data = c.req.valid("json") as CreateShowcaseInput;
  const db = createDbInstance(c.env.DB);

  try {
    const result = await createShowcaseService(db, data);
    return c.json(result, 201);
  } catch (error) {
    return handleError(error, c, "Failed to create showcase");
  }
};
