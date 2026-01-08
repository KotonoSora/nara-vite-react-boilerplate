import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

/**
 * Showcases catalog with string-based primary keys for global uniqueness.
 */
export const showcase = sqliteTable("showcases", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  image: text("image"),
  authorId: text("author_id").references(() => user.id, {
    onDelete: "set null",
  }),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

/**
 * Tags associated with showcases. Uses string IDs and FK to `showcases.id`.
 */
export const showcaseTag = sqliteTable("showcase_tags", {
  id: text("id").primaryKey(),
  showcaseId: text("showcase_id")
    .notNull()
    .references(() => showcase.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});
