import { data } from "react-router";

import type { Route } from "./+types/action.showcase.publish";

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
 * Publishes a showcase by setting publishedAt to current time.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    const { publishShowcaseSchema } =
      await import("~/features/landing-page/schemas/publish-showcase.schema");
    const { publishShowcase } =
      await import("~/features/landing-page/utils/publish-showcase");

    const result = publishShowcaseSchema.safeParse(rawData);

    if (!result.success) {
      return data({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { showcaseId } = result.data;

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };
    const showcase = await publishShowcase(db, showcaseId);

    if (!showcase) {
      return data({ error: "Showcase not found" }, { status: 404 });
    }

    return data({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish showcase";
    return data({ error: message }, { status: 500 });
  }
}
