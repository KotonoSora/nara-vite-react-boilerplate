import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

/**
 * Sessions associated with users for authentication.
 * Cascades on user deletion to remove related sessions.
 */
export const session = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
