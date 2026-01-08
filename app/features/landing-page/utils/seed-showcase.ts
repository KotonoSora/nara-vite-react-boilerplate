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
    await db.delete(showcaseTag).run();
    await db.delete(showcase).run();

    const chunkSize = 10;

    const showcasesWithIds = showcases.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    }));

    for (let i = 0; i < showcasesWithIds.length; i += chunkSize) {
      const batch = showcasesWithIds.slice(i, i + chunkSize);
      await db.insert(showcase).values(batch).run();
    }

    const tagRows = showcasesWithIds.flatMap(({ id, tags }) =>
      (tags ?? []).map((tag) => ({
        id: crypto.randomUUID(),
        showcaseId: id,
        tag,
      })),
    );

    if (tagRows.length) {
      for (let i = 0; i < tagRows.length; i += chunkSize) {
        const batch = tagRows.slice(i, i + chunkSize);
        await db.insert(showcaseTag).values(batch).run();
      }
    }
  } catch (error) {
    console.error("Error seeding showcases:", error);
  }
}
