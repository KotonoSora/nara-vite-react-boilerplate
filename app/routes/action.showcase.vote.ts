import { data } from "react-router";

import type { Route } from "./+types/action.showcase.vote";

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
 * Handles a user's vote on a showcase.
 *
 * Implementation details:
 * - Expects `showcaseId`, `userId`, and `value` ("-1" or "1") in form data.
 * - Validates inputs with `voteShowcaseSchema`.
 * - Delegates DB logic to `voteShowcase` util (upsert vote, adjust counters atomically).
 * - Returns the updated vote/counter payload for UI state sync.
 */
export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);

    const { voteShowcaseSchema } =
      await import("~/features/landing-page/schemas/vote-showcase.schema");
    const { voteShowcase } =
      await import("~/features/landing-page/utils/vote-showcase");

    const result = voteShowcaseSchema.safeParse(rawData);
    if (!result.success) {
      return data({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { showcaseId, userId, value } = result.data;

    const { db } = context as { db: DrizzleD1Database<typeof dbSchema> };
    const voteResult = await voteShowcase(db, { showcaseId, userId, value });

    if (!voteResult) {
      return data({ error: "Showcase not found" }, { status: 404 });
    }

    return data({ success: true, vote: voteResult }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to vote on showcase";
    return data({ error: message }, { status: 500 });
  }
}
