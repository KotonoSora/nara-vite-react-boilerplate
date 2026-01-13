import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tags used to categorize showcases.
 * Unique slug supports stable URLs linking and lookup.
 */
export const tag = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;
