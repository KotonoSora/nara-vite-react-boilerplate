import { data } from "react-router";

import type { Route } from "./+types/action.showcase.update";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";
import {
  parseValidationErrors,
  updateShowcaseSchema,
} from "~/features/landing-page/schemas/update-showcase.schema";
import { updateShowcase } from "~/features/landing-page/utils/update-showcase";

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
 * Updates an existing showcase with new data and tag associations.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();

    const raw = {
      showcaseId: formData.get("showcaseId") ?? "",
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      url: formData.get("url") ?? "",
      image: formData.get("image") ?? "",
      publishedAt: formData.get("publishedAt") ?? "",
      tags: formData.getAll("tags"),
    };

    const result = updateShowcaseSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors = parseValidationErrors(result);
      return data({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const { showcaseId, name, description, url, image, publishedAt, tags } =
      result.data;
    const imageValue = image && image.length ? image : undefined;
    const publishedAtDate =
      publishedAt instanceof Date ? publishedAt : undefined;

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };
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
