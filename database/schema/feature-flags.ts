import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userGroups = sqliteTable("user_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const featureFlags = sqliteTable("feature_flags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  rolloutPercentage: real("rollout_percentage").notNull().default(0),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const featureFlagAssignments = sqliteTable("feature_flag_assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  featureFlagId: integer("feature_flag_id")
    .notNull()
    .references(() => featureFlags.id, { onDelete: "cascade" }),
  userGroupId: integer("user_group_id")
    .references(() => userGroups.id, { onDelete: "cascade" }),
  userId: text("user_id"), // For individual user assignments
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});