import { eq } from "drizzle-orm";
import { data } from "react-router";

import type { Route } from "./+types/action.showcase.delete";

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
 * Deletes a showcase only if the authenticated user is its author.
 * Ensures ownership by comparing `AuthContext.userId` with `showcase.authorId`.
 * Returns 401 when unauthenticated, 403 when not the author, 404 if not found.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const formValues = Object.fromEntries(formData);

    const { deleteShowcaseSchema } =
      await import("~/features/landing-page/schemas/delete-showcase.schema");
    const { deleteShowcase } =
      await import("~/features/landing-page/utils/delete-showcase");

    const parsed = deleteShowcaseSchema.safeParse(formValues);
    if (!parsed.success) {
      return data({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { showcaseId } = parsed.data;

    // Get current authenticated user from middleware context
    const { userId } = context.get(AuthContext) ?? { userId: null };
    if (!userId) {
      return data({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };

    // Verify ownership before allowing deletion
    const rows = await db
      .select()
      .from(dbSchema.showcase)
      .where(eq(dbSchema.showcase.id, showcaseId))
      .execute();

    const existing = rows?.[0];
    if (!existing) {
      return data({ error: "Showcase not found" }, { status: 404 });
    }

    if (existing.authorId !== userId) {
      return data({ error: "Forbidden" }, { status: 403 });
    }

    await deleteShowcase(db, showcaseId);
    return data({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete showcase";
    return data({ error: message }, { status: 500 });
  }
}
