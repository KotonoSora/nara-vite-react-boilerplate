import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { ProjectInfoWithoutID } from "../types/type";

import * as schema from "~/database/schema/showcase";

const { showcase, showcaseTag } = schema;

/**
 * Seeds the database with showcase information.
 *
 * @param db - The database instance.
 * @param showcases - The showcase information to seed.
 */
export async function seedShowcases(
  db: DrizzleD1Database<typeof schema>,
  showcases: ProjectInfoWithoutID[],
) {
  try {
    const existingShowcase = await db
      .select({ id: showcase.id })
      .from(showcase)
      .limit(1);

    if (!existingShowcase.length && showcases) {
      await db.insert(showcase).values(showcases);
    }

    const existingShowcaseTags = await db
      .select({ id: showcaseTag.id })
      .from(showcaseTag)
      .limit(1);

    if (!existingShowcaseTags.length) {
      const showcaseRows = await db.select({ id: showcase.id }).from(showcase);

      const tagRows = [
        { showcaseId: showcaseRows[0].id, tag: "finance" },
        { showcaseId: showcaseRows[0].id, tag: "tools" },
        { showcaseId: showcaseRows[1].id, tag: "pomodoro" },
        { showcaseId: showcaseRows[1].id, tag: "forest" },
        { showcaseId: showcaseRows[2].id, tag: "family tree" },
        { showcaseId: showcaseRows[2].id, tag: "visualizer" },
        { showcaseId: showcaseRows[3].id, tag: "UI library" },
        { showcaseId: showcaseRows[3].id, tag: "tools" },
      ];

      await db.insert(showcaseTag).values(tagRows);
    }
  } catch (error) {
    console.error(error);
  }
}
