import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { ProjectInfo } from "~/features/showcases/types/type";

import * as schema from "~/database/schema";

const { showcase, showcaseTag, tag } = schema;

/**
 * Get the showcases from the database.
 *
 * @param db The database instance.
 * @returns The list of showcases.
 */
export async function getShowcases(db: DrizzleD1Database<typeof schema>) {
  const rows = await db
    .select({
      id: showcase.id,
      name: showcase.name,
      description: showcase.description,
      url: showcase.url,
      image: showcase.image,
      tagName: tag.name,
    })
    .from(showcase)
    .leftJoin(showcaseTag, eq(showcase.id, showcaseTag.showcaseId))
    .leftJoin(tag, eq(showcaseTag.tagId, tag.id))
    .all();

  const map = new Map<string, ProjectInfo>();

  for (const row of rows) {
    const key = String(row.id);

    if (!map.has(key)) {
      map.set(key, {
        id: row.id,
        name: row.name,
        description: row.description,
        url: row.url,
        image: row.image ?? undefined,
        tags: [],
      });
    }

    if (row.tagName) {
      map.get(key)!.tags.push(row.tagName);
    }
  }

  return Array.from(map.values());
}
