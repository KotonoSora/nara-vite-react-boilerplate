import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Showcases catalog with string-based primary keys for global uniqueness.
 */
export const showcase = sqliteTable("showcases", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  image: text("image"),
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
