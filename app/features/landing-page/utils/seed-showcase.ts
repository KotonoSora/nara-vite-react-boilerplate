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
    if (!showcases?.length) return;

    await db.transaction(async (tx) => {
      await tx.delete(showcaseTag).run();
      await tx.delete(showcase).run();

      const showcasesWithIds = showcases.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      }));

      await tx.insert(showcase).values(showcasesWithIds).run();

      const tagRows = showcasesWithIds.flatMap(({ id, tags }) =>
        (tags ?? []).map((tag) => ({
          id: crypto.randomUUID(),
          showcaseId: id,
          tag,
        })),
      );

      if (tagRows.length) {
        await tx.insert(showcaseTag).values(tagRows).run();
      }
    });
  } catch (error) {
    console.error("Error seeding showcases:", error);
  }
}
