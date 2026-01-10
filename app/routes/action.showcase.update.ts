import { eq } from "drizzle-orm";
import { data } from "react-router";

import type { Route } from "./+types/action.showcase.update";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";
import {
  parseValidationErrors,
  updateShowcaseSchema,
} from "~/features/landing-page/schemas/update-showcase.schema";
import { updateShowcase } from "~/features/landing-page/utils/update-showcase";
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
 * Updates a showcase only if the authenticated user is its author.
 * Validates ownership by matching `AuthContext.userId` with `showcase.authorId`.
 * Returns 401 when unauthenticated, 403 when not the author, 404 if not found.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();

    const formValues = {
      showcaseId: formData.get("showcaseId") ?? "",
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      url: formData.get("url") ?? "",
      image: formData.get("image") ?? "",
      publishedAt: formData.get("publishedAt") ?? "",
      tags: formData.getAll("tags"),
    };

    const parsed = updateShowcaseSchema.safeParse(formValues);
    if (!parsed.success) {
      const fieldErrors = parseValidationErrors(parsed);
      return data({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const { showcaseId, name, description, url, image, publishedAt, tags } =
      parsed.data;
    const imageValue = image && image.length ? image : undefined;
    const publishedAtDate =
      publishedAt instanceof Date ? publishedAt : undefined;

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

    const showcase = await updateShowcase(db, {
      showcaseId,
      name,
      description,
      url,
      image: imageValue,
      publishedAt: publishedAtDate,
      tags,
    });

    return data({ success: true, showcase }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update showcase";
    return data({ error: message }, { status: 500 });
  }
}
