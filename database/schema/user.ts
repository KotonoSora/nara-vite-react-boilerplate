import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Users table with string-based primary key for cross-environment uniqueness.
 */
export const user = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: integer("email_verification_expires", {
    mode: "timestamp",
  }),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: integer("password_reset_expires", {
    mode: "timestamp",
  }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Sessions tied to a user via string FK. Session IDs remain string.
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
