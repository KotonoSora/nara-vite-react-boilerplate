import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { showcase } from "./showcase";
import { user } from "./user";

/**
 * Votes cast by users on showcases.
 * Composite PK (showcaseId, userId) prevents duplicate votes.
 * Value is type-restricted to -1 or 1 at the TypeScript level.
 */
export const showcaseVote = sqliteTable(
  "showcase_votes",
  {
    showcaseId: text("showcase_id")
      .notNull()
      .references(() => showcase.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    value: integer("value").$type<-1 | 1>().notNull(),

    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
  },
  (table) => [primaryKey({ columns: [table.showcaseId, table.userId] })],
);

export type ShowcaseVote = typeof showcaseVote.$inferSelect;
export type NewShowcaseVote = typeof showcaseVote.$inferInsert;
