import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

/**
 * Showcases submitted by users.
 * Includes aggregate counters for fast reads: upvotes, downvotes, score.
 * Author relationship uses SET NULL on delete to preserve showcases.
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

  // Aggregate counters
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  score: integer("score").notNull().default(0),

  publishedAt: integer("published_at", { mode: "timestamp" }),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export type Showcase = typeof showcase.$inferSelect;
export type NewShowcase = typeof showcase.$inferInsert;
