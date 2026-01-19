import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { showcase } from "./showcase";
import { tag } from "./tag";

/**
 * Join table linking showcases and tags (many-to-many).
 * Composite PK (showcaseId, tagId) enforces uniqueness per pair.
 */
export const showcaseTag = sqliteTable(
  "showcase_tags",
  {
    showcaseId: text("showcase_id")
      .notNull()
      .references(() => showcase.id, { onDelete: "cascade" }),

    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
  },
  (table) => [primaryKey({ columns: [table.showcaseId, table.tagId] })],
);

export type ShowcaseTag = typeof showcaseTag.$inferSelect;
export type NewShowcaseTag = typeof showcaseTag.$inferInsert;
