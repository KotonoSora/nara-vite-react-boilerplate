import { integer, text } from "drizzle-orm/sqlite-core";

import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

// Shared enums
export const USER_ROLES = ["admin", "user"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const OAUTH_PROVIDERS = ["google", "github"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export const TIME_FORMATS = ["12h", "24h"] as const;
export type TimeFormat = (typeof TIME_FORMATS)[number];

export const THEMES = ["light", "dark", "auto"] as const;
export type Theme = (typeof THEMES)[number];

// Small helpers to avoid duplication across tables
export const now = () => new Date();

export function idPk(name: string = "id") {
  return integer(name).primaryKey({ autoIncrement: true });
}

export function createdAt(name: string = "created_at") {
  return integer(name, { mode: "timestamp" }).notNull().$defaultFn(now);
}

export function updatedAt(name: string = "updated_at") {
  return integer(name, { mode: "timestamp" }).notNull().$defaultFn(now);
}

export function timestamp(name: string, opts?: { notNull?: boolean }) {
  const base = integer(name, { mode: "timestamp" });
  return opts?.notNull ? base.notNull() : base;
}

export function boolInt(
  name: string,
  defaultValue?: boolean,
  opts?: { notNull?: boolean },
) {
  let col = integer(name, { mode: "boolean" });
  if (opts?.notNull ?? true) col = col.notNull();
  if (typeof defaultValue === "boolean") col = col.default(defaultValue);
  return col;
}

export function textEnum<T extends readonly [string, ...string[]]>(
  name: string,
  values: T,
) {
  return text(name, { enum: values });
}

export function fkInt(
  name: string,
  ref: () => AnySQLiteColumn,
  options?: {
    onDelete?:
      | "cascade"
      | "set null"
      | "restrict"
      | "no action"
      | "set default";
  },
  opts?: { notNull?: boolean },
) {
  let col = integer(name);
  if (opts?.notNull ?? true) col = col.notNull();
  return col.references(ref, options);
}
