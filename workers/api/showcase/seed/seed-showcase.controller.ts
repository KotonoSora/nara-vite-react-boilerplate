import type { Context } from "hono";

import type {
  SeedShowcaseItem,
  SeedShowcaseResponse,
} from "./seed-showcase.model";
import type { SeedShowcaseInput } from "./seed-showcase.validator";

import { createDbInstance } from "~/workers/api/_shared/database/db.factory";
import { handleError } from "~/workers/api/_shared/errors/error.handler";

import { seedShowcaseService } from "./seed-showcase.service";

/**
 * Controller for seeding showcases.
 * Orchestrates request handling without business logic.
 */
export const seedShowcaseController = async (
  c: Context<{ Bindings: Env }, any, any>,
): Promise<Response> => {
  const { showcases } = c.req.valid("json") as SeedShowcaseInput;
  const db = createDbInstance(c.env.DB);

  try {
    const count = await seedShowcaseService(
      db,
      showcases as SeedShowcaseItem[],
    );
    const response: SeedShowcaseResponse = {
      message: "Showcases seeded",
      count,
    };
    return c.json(response, 201);
  } catch (error) {
    return handleError(error, c, "Failed to seed showcases");
  }
};
