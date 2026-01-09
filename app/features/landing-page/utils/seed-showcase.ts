import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { ProjectInfoWithoutID } from "../types/type";

import * as schema from "~/database/schema";

const { showcase, showcaseTag, tag } = schema;

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

    // Create/find tags and link them to showcases
    for (const { id: showcaseId, tags: tagNames } of showcasesWithIds) {
      if (!tagNames?.length) continue;

      for (const tagName of tagNames) {
        const slug = tagName.toLowerCase().replace(/\s+/g, "-");

        // Check if tag exists
        const existingTag = await db
          .select()
          .from(tag)
          .where(eq(tag.slug, slug))
          .get();

        let tagId: string;

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // Create new tag
          tagId = crypto.randomUUID();
          await db.insert(tag).values({
            id: tagId,
            name: tagName,
            slug: slug,
          });
        }

        // Link showcase to tag
        await db.insert(showcaseTag).values({
          showcaseId,
          tagId,
        });
      }
    }
  } catch (error) {
    console.error("Error seeding showcases:", error);
  }
}
