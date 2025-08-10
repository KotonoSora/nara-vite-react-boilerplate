import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: integer("email_verification_expires", { mode: "timestamp" }),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: integer("password_reset_expires", { mode: "timestamp" }),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const session = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const loginLog = sqliteTable("login_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  success: integer("success", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
