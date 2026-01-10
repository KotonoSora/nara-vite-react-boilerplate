import { eq } from "drizzle-orm";
import { data } from "react-router";

import type { Route } from "./+types/action.showcase.unpublish";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";
import { AuthContext } from "~/middleware/auth";

export function loader({ request }: Route.LoaderArgs) {
  return data(
    {},
    {
      status: 302,
      headers: {
        Location: request.headers.get("referer") || "/",
      },
    },
  );
}

/**
 * Unpublishes a showcase only if the authenticated user is its author.
 * Validates ownership by matching `AuthContext.userId` with `showcase.authorId`.
 * Returns 401 when unauthenticated, 403 when not the author, 404 if not found.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const formValues = Object.fromEntries(formData);

    const { unpublishShowcaseSchema } =
      await import("~/features/landing-page/schemas/unpublish-showcase.schema");
    const { unpublishShowcase } =
      await import("~/features/landing-page/utils/unpublish-showcase");

    const parsed = unpublishShowcaseSchema.safeParse(formValues);
    if (!parsed.success) {
      return data({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { showcaseId } = parsed.data;

    const { userId } = context.get(AuthContext) ?? { userId: null };
    if (!userId) {
      return data({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };
    const existing = await db
      .select()
      .from(dbSchema.showcase)
      .where(eq(dbSchema.showcase.id, showcaseId))
      .get();

    if (!existing) {
      return data({ error: "Showcase not found" }, { status: 404 });
    }

    if (existing.authorId !== userId) {
      return data({ error: "Forbidden" }, { status: 403 });
    }

    const showcase = await unpublishShowcase(db, showcaseId);

    return data({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to unpublish showcase";
    return data({ error: message }, { status: 500 });
  }
}
