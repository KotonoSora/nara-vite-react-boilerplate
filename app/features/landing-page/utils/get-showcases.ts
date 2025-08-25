import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { ProjectInfo } from "../types/type";

import * as schema from "~/database/schema/showcase";

const { showcase, showcaseTag } = schema;

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
      tag: showcaseTag.tag,
    })
    .from(showcase)
    .leftJoin(showcaseTag, eq(showcase.id, showcaseTag.showcaseId));

  const map = new Map<number, ProjectInfo>();

  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        url: row.url,
        image: row.image ?? undefined,
        tags: [],
      });
    }

    if (row.tag) {
      map.get(row.id)!.tags.push(row.tag);
    }
  }

  return Array.from(map.values());
}
