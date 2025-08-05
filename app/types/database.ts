/**
 * Database-related type definitions
 * Centralized location for all database types used across the application
 */

import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "~/database/schema";

// Database instance type
export type Database = DrizzleD1Database<typeof schema>;

// Schema types
export type DatabaseSchema = typeof schema;

// User table types
export type UserTable = typeof schema.user;
export type UserSelect = typeof schema.user.$inferSelect;
export type UserInsert = typeof schema.user.$inferInsert;

// Showcase table types (if available)
export type ShowcaseTable = typeof schema.showcase;
export type ShowcaseSelect = typeof schema.showcase.$inferSelect;
export type ShowcaseInsert = typeof schema.showcase.$inferInsert;

// Generic database operation result
export interface DatabaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Database transaction callback type
export type TransactionCallback<T> = (db: Database) => Promise<T>;

// Common database query options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

// Database migration info
export interface MigrationInfo {
  id: string;
  name: string;
  appliedAt: Date;
}

// Database connection status
export interface DatabaseStatus {
  connected: boolean;
  version?: string;
  migrations?: MigrationInfo[];
}