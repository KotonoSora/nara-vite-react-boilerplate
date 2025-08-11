import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  boolInt,
  createdAt as colCreatedAt,
  updatedAt as colUpdatedAt,
  fkInt,
  idPk,
  OAUTH_PROVIDERS,
  textEnum,
  THEMES,
  TIME_FORMATS,
  timestamp as ts,
  USER_ROLES,
} from "./common";

export const user = sqliteTable(
  "users",
  {
    id: idPk(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"), // Optional for OAuth users
    name: text("name").notNull(),
    avatar: text("avatar"), // Profile picture URL
    role: textEnum("role", USER_ROLES).notNull().default("user"),
    createdBy: integer("created_by"),
    emailVerified: boolInt("email_verified", false),
    emailVerificationToken: text("email_verification_token"),
    emailVerificationExpires: ts("email_verification_expires"),
    passwordResetToken: text("password_reset_token"),
    passwordResetExpires: ts("password_reset_expires"),
    lastLoginAt: ts("last_login_at"),
    createdAt: colCreatedAt(),
    updatedAt: colUpdatedAt(),
  },
  (table) => [
    index("user_email_idx").on(table.email),
    index("user_role_idx").on(table.role),
    index("user_created_by_idx").on(table.createdBy),
  ],
);

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

// OAuth accounts table for social login
export const oauthAccount = sqliteTable(
  "oauth_accounts",
  {
    id: idPk(),
    userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
    provider: textEnum("provider", OAUTH_PROVIDERS).notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: ts("expires_at"),
    createdAt: colCreatedAt(),
    updatedAt: colUpdatedAt(),
  },
  (table) => [
    index("oauth_account_user_idx").on(table.userId),
    index("oauth_account_provider_idx").on(
      table.provider,
      table.providerAccountId,
    ),
  ],
);

// Permissions system for enhanced RBAC
export const permission = sqliteTable(
  "permissions",
  {
    id: idPk(),
    name: text("name").notNull().unique(),
    description: text("description"),
    resource: text("resource").notNull(), // e.g., "user", "post", "admin"
    action: text("action").notNull(), // e.g., "create", "read", "update", "delete"
    createdAt: colCreatedAt(),
  },
  (table) => [
    index("permission_name_idx").on(table.name),
    index("permission_resource_action_idx").on(table.resource, table.action),
  ],
);

// Role permissions junction table
export const rolePermission = sqliteTable(
  "role_permissions",
  {
    id: idPk(),
    role: textEnum("role", USER_ROLES).notNull(),
    permissionId: fkInt("permission_id", () => permission.id, {
      onDelete: "cascade",
    }),
    createdAt: colCreatedAt(),
  },
  (table) => [index("role_permission_idx").on(table.role, table.permissionId)],
);

// User-specific permissions (overrides role permissions)
export const userPermission = sqliteTable(
  "user_permissions",
  {
    id: idPk(),
    userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
    permissionId: fkInt("permission_id", () => permission.id, {
      onDelete: "cascade",
    }),
    granted: boolInt("granted", true),
    createdAt: colCreatedAt(),
  },
  (table) => [
    index("user_permission_idx").on(table.userId, table.permissionId),
  ],
);

export const session = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
  expiresAt: ts("expires_at", { notNull: true }),
  createdAt: colCreatedAt(),
});

export const loginLog = sqliteTable("login_logs", {
  id: idPk(),
  userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  success: boolInt("success", true),
  provider: text("provider"), // null for password, "google", "github" for OAuth
  createdAt: colCreatedAt(),
});

// API tokens for JWT authentication
export const apiToken = sqliteTable(
  "api_tokens",
  {
    id: idPk(),
    userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // Human-readable name for the token
    tokenHash: text("token_hash").notNull().unique(),
    lastUsedAt: ts("last_used_at"),
    expiresAt: ts("expires_at"),
    scopes: text("scopes"), // JSON array of allowed scopes
    createdAt: colCreatedAt(),
  },
  (table) => [
    index("api_token_user_idx").on(table.userId),
    index("api_token_hash_idx").on(table.tokenHash),
  ],
);

// Rate limiting table
export const rateLimitLog = sqliteTable(
  "rate_limit_logs",
  {
    id: idPk(),
    identifier: text("identifier").notNull(), // IP address or user ID
    endpoint: text("endpoint").notNull(), // e.g., "/login", "/register"
    attempts: integer("attempts").notNull().default(1),
    windowStart: ts("window_start", { notNull: true }),
    createdAt: colCreatedAt(),
  },
  (table) => [
    index("rate_limit_identifier_endpoint_idx").on(
      table.identifier,
      table.endpoint,
    ),
    index("rate_limit_window_idx").on(table.windowStart),
  ],
);

// Multi-Factor Authentication (MFA) table for enhanced security
export const mfaSecret = sqliteTable(
  "mfa_secrets",
  {
    id: idPk(),
    userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
    secret: text("secret").notNull(), // Base32 encoded TOTP secret
    backupCodes: text("backup_codes"), // JSON array of backup codes
    isEnabled: boolInt("is_enabled", false),
    lastUsedAt: ts("last_used_at"),
    createdAt: colCreatedAt(),
    updatedAt: colUpdatedAt(),
  },
  (table) => [index("mfa_secret_user_idx").on(table.userId)],
);

// Device tracking for security and session management
export const trustedDevice = sqliteTable(
  "trusted_devices",
  {
    id: idPk(),
    userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
    deviceFingerprint: text("device_fingerprint").notNull(),
    deviceName: text("device_name"), // User-friendly device name
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    lastSeenAt: ts("last_seen_at", { notNull: true }),
    isTrusted: boolInt("is_trusted", false),
    createdAt: colCreatedAt(),
  },
  (table) => [
    index("trusted_device_user_device_idx").on(
      table.userId,
      table.deviceFingerprint,
    ),
    index("trusted_device_last_seen_idx").on(table.lastSeenAt),
  ],
);

// Security audit logs for compliance and monitoring
export const securityAuditLog = sqliteTable(
  "security_audit_logs",
  {
    id: idPk(),
    userId: fkInt(
      "user_id",
      () => user.id,
      { onDelete: "set null" },
      { notNull: false },
    ),
    action: text("action").notNull(), // login, logout, password_change, mfa_enable, etc.
    resource: text("resource"), // What was accessed or modified
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    deviceFingerprint: text("device_fingerprint"),
    details: text("details"), // JSON object with additional context
    success: boolInt("success", true),
    createdAt: colCreatedAt(),
  },
  (table) => [
    index("security_audit_user_idx").on(table.userId),
    index("security_audit_action_idx").on(table.action),
    index("security_audit_created_at_idx").on(table.createdAt),
  ],
);

// User preferences for i18n and other settings
export const userPreference = sqliteTable(
  "user_preferences",
  {
    id: idPk(),
    userId: fkInt("user_id", () => user.id, { onDelete: "cascade" }),
    preferredLanguage: text("preferred_language").notNull().default("en"),
    fallbackLanguages: text("fallback_languages"), // JSON array
    timezone: text("timezone").notNull().default("UTC"),
    dateFormat: text("date_format").notNull().default("MM/dd/yyyy"),
    timeFormat: textEnum("time_format", TIME_FORMATS).notNull().default("12h"),
    currency: text("currency").notNull().default("USD"),
    theme: textEnum("theme", THEMES).notNull().default("auto"),
    notifications: text("notifications"), // JSON object with notification preferences
    createdAt: colCreatedAt(),
    updatedAt: colUpdatedAt(),
  },
  (table) => [index("user_preference_user_idx").on(table.userId)],
);

// Define relations after table definitions to avoid circular references
export const userRelations = {
  createdBy: user.id, // Reference for the createdBy field
};
