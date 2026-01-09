import { data } from "react-router";

import type { Route } from "./+types/action.showcase.unpublish";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";

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
 * Unpublishes a showcase by removing publishedAt timestamp.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    const { unpublishShowcaseSchema } =
      await import("~/features/landing-page/schemas/unpublish-showcase.schema");
    const { unpublishShowcase } =
      await import("~/features/landing-page/utils/unpublish-showcase");

    const result = unpublishShowcaseSchema.safeParse(rawData);

    if (!result.success) {
      return data({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { showcaseId } = result.data;

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };
    const showcase = await unpublishShowcase(db, showcaseId);

    if (!showcase) {
      return data({ error: "Showcase not found" }, { status: 404 });
    }

    return data({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to unpublish showcase";
    return data({ error: message }, { status: 500 });
  }
}
