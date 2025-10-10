import { eq } from "drizzle-orm";

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
    await db.delete(showcase).execute();
    await db.delete(showcaseTag).execute();

    const existingShowcase = await db
      .select({ id: showcase.id })
      .from(showcase)
      .limit(1);

    if (!existingShowcase.length && showcases) {
      await db.insert(showcase).values(showcases);

      const insertedShowcases = await db
        .select({ id: showcase.id })
        .from(showcase)
        .execute();

      for (const [index, showcase] of insertedShowcases.entries()) {
        if (showcases[index].tags) {
          await db.insert(showcaseTag).values(
            showcases[index].tags.map((tag) => ({
              showcaseId: showcase.id,
              tag,
            })),
          );
        }
      }
    }
  } catch (error) {
    console.error("Error seeding showcases:", error);
  }
}
