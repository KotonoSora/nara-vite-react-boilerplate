import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const showcase = sqliteTable("showcases", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  image: text("image"),
});

export const showcaseTag = sqliteTable("showcase_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  showcaseId: integer("showcase_id")
    .notNull()
    .references(() => showcase.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});
