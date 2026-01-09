import { data } from "react-router";

import type { Route } from "./+types/action.showcase.delete";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";
import { deleteShowcaseSchema } from "~/features/landing-page/schemas/delete-showcase.schema";
import { deleteShowcase } from "~/features/landing-page/utils/delete-showcase";

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

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    const result = deleteShowcaseSchema.safeParse(rawData);

    if (!result.success) {
      return data({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { showcaseId } = result.data;

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };
    await deleteShowcase(db, showcaseId);

    return data({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete showcase";
    return data({ error: message }, { status: 500 });
  }
}
