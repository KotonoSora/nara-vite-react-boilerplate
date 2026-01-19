import { zValidator as zv } from "@hono/zod-validator";
import z from "zod";

import type { ValidationTargets } from "hono";

export const zValidator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: "Invalid request",
          errors: JSON.parse(result.error.message),
        },
        422,
      );
    }
  });
