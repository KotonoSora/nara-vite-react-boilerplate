import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // Optional for OAuth users
  name: text("name").notNull(),
  avatar: text("avatar"), // Profile picture URL
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
}, (table) => ({
  emailIdx: index("user_email_idx").on(table.email),
  roleIdx: index("user_role_idx").on(table.role),
}));

// OAuth accounts table for social login
export const oauthAccount = sqliteTable("oauth_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["google", "github"] }).notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  userIdx: index("oauth_account_user_idx").on(table.userId),
  providerIdx: index("oauth_account_provider_idx").on(table.provider, table.providerAccountId),
}));

// Permissions system for enhanced RBAC
export const permission = sqliteTable("permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  resource: text("resource").notNull(), // e.g., "user", "post", "admin"
  action: text("action").notNull(), // e.g., "create", "read", "update", "delete"
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  nameIdx: index("permission_name_idx").on(table.name),
  resourceActionIdx: index("permission_resource_action_idx").on(table.resource, table.action),
}));

// Role permissions junction table
export const rolePermission = sqliteTable("role_permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role", { enum: ["admin", "user"] }).notNull(),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permission.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  rolePermissionIdx: index("role_permission_idx").on(table.role, table.permissionId),
}));

// User-specific permissions (overrides role permissions)
export const userPermission = sqliteTable("user_permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permission.id, { onDelete: "cascade" }),
  granted: integer("granted", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  userPermissionIdx: index("user_permission_idx").on(table.userId, table.permissionId),
}));

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
  provider: text("provider"), // null for password, "google", "github" for OAuth
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// API tokens for JWT authentication
export const apiToken = sqliteTable("api_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // Human-readable name for the token
  tokenHash: text("token_hash").notNull().unique(),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  scopes: text("scopes"), // JSON array of allowed scopes
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  userIdx: index("api_token_user_idx").on(table.userId),
  tokenHashIdx: index("api_token_hash_idx").on(table.tokenHash),
}));

// Rate limiting table
export const rateLimitLog = sqliteTable("rate_limit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  identifier: text("identifier").notNull(), // IP address or user ID
  endpoint: text("endpoint").notNull(), // e.g., "/login", "/register"
  attempts: integer("attempts").notNull().default(1),
  windowStart: integer("window_start", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  identifierEndpointIdx: index("rate_limit_identifier_endpoint_idx").on(table.identifier, table.endpoint),
  windowIdx: index("rate_limit_window_idx").on(table.windowStart),
}));
