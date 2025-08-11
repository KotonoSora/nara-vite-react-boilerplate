import { data } from "react-router";

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { AuthResult, SecurityLevel } from "./middleware.server";

import * as schema from "~/database/schema";

import {
  authenticate,
  requireAdmin,
  requireAuthentication,
  requireCriticalSecurity,
  requireHighSecurity,
} from "./middleware.server";

/**
 * Route security configuration utilities
 * Provides easy-to-use decorators and helpers for applying security to routes
 */

interface RouteSecurityConfig {
  level: SecurityLevel;
  permissions?: string[];
  realm?: string;
  redirectUrl?: string;
}

/**
 * Security decorator for route loaders
 */
export function withSecurity(config: RouteSecurityConfig) {
  return function <T extends any[], R>(
    loader: (authResult: AuthResult, ...args: T) => Promise<R>,
  ) {
    return async function (
      request: Request,
      db: DrizzleD1Database<typeof schema>,
      ...args: T
    ): Promise<R> {
      const authResult = await authenticate(request, db, {
        securityLevel: config.level,
        requiredPermissions: config.permissions || [],
        basicAuthRealm: config.realm,
        redirectUrl: config.redirectUrl,
      });

      return loader(authResult, ...args);
    };
  };
}

/**
 * Standard security decorator
 */
export const withStandardSecurity = (permissions: string[] = []) =>
  withSecurity({ level: "standard", permissions });

/**
 * High security decorator
 */
export const withHighSecurity = (permissions: string[] = []) =>
  withSecurity({ level: "high", permissions });

/**
 * Critical security decorator
 */
export const withCriticalSecurity = (permissions: string[] = []) =>
  withSecurity({ level: "critical", permissions });

/**
 * Admin security decorator
 */
export const withAdminSecurity = () =>
  withSecurity({ level: "high", permissions: ["admin.manage"] });

/**
 * Route security middleware that returns the auth result
 * Use this in route loaders/actions
 */
export async function applySecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  config: RouteSecurityConfig,
): Promise<AuthResult> {
  return authenticate(request, db, {
    securityLevel: config.level,
    requiredPermissions: config.permissions || [],
    basicAuthRealm: config.realm,
    redirectUrl: config.redirectUrl,
  });
}

/**
 * Quick security application functions
 */
export async function applyStandardSecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  permissions: string[] = [],
): Promise<AuthResult> {
  return requireAuthentication(request, db);
}

export async function applyHighSecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  permissions: string[] = [],
): Promise<AuthResult> {
  return requireHighSecurity(request, db, permissions);
}

export async function applyCriticalSecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  permissions: string[] = [],
): Promise<AuthResult> {
  return requireCriticalSecurity(request, db, permissions);
}

export async function applyAdminSecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
): Promise<AuthResult> {
  return requireAdmin(request, db);
}

/**
 * Security context for components
 */
export interface SecurityContext {
  user: typeof schema.user.$inferSelect;
  authFlow: "ui" | "api";
  securityLevel: SecurityLevel;
  permissions: string[];
  isAdmin: boolean;
}

/**
 * Create security context from auth result
 */
export function createSecurityContext(
  authResult: AuthResult,
  securityLevel: SecurityLevel,
  permissions: string[] = [],
): SecurityContext {
  return {
    user: authResult.user,
    authFlow: authResult.flow,
    securityLevel,
    permissions,
    isAdmin: authResult.user.role === "admin",
  };
}

/**
 * Route helper that applies security and returns context
 */
export async function secureRoute(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  config: RouteSecurityConfig,
): Promise<SecurityContext> {
  const authResult = await applySecurity(request, db, config);

  return createSecurityContext(authResult, config.level, config.permissions);
}

/**
 * Predefined security configurations
 */
export const SECURITY_CONFIGS = {
  standard: { level: "standard" as const, permissions: [] },
  profile: { level: "high" as const, permissions: ["profile.read"] },
  profileEdit: { level: "high" as const, permissions: ["profile.update"] },
  admin: { level: "high" as const, permissions: ["admin.manage"] },
  critical: { level: "critical" as const, permissions: ["admin.manage"] },
  userManagement: {
    level: "high" as const,
    permissions: ["user.read", "user.update"],
  },
  systemAdmin: {
    level: "critical" as const,
    permissions: ["admin.manage", "system.admin"],
  },
} as const;

/**
 * Quick route security application using predefined configs
 */
export async function applySecurityConfig(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  configName: keyof typeof SECURITY_CONFIGS,
): Promise<SecurityContext> {
  const config = SECURITY_CONFIGS[configName];
  // Convert readonly array to mutable array
  const mutableConfig = {
    ...config,
    permissions: [...(config.permissions || [])],
  };
  return secureRoute(request, db, mutableConfig);
}

/**
 * Error response helpers for different security failures
 */
export function createUnauthorizedResponse(
  message: string = "Authentication required",
) {
  return data({ error: message }, { status: 401 });
}

export function createForbiddenResponse(message: string = "Permission denied") {
  return data({ error: message }, { status: 403 });
}

export function createBasicAuthChallenge(realm: string = "Secure Area") {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}"`,
      "Content-Type": "text/plain",
    },
  });
}

/**
 * Security validation helpers
 */
export function validateSecurityLevel(level: string): level is SecurityLevel {
  return ["standard", "high", "critical"].includes(level);
}

export function validatePermissions(permissions: string[]): boolean {
  // Basic permission format validation (resource.action)
  const permissionPattern = /^[a-z]+\.[a-z]+$/;
  return permissions.every((perm) => permissionPattern.test(perm));
}

/**
 * Security logging helper
 */
export async function logSecurityAccess(
  db: DrizzleD1Database<typeof schema>,
  auth: AuthResult | number | null,
  request: Request,
  route: string,
  securityLevel: SecurityLevel,
  details?: Record<string, unknown>,
) {
  const { logSecurityEvent } = await import("./device-tracking.server");

  const userId = typeof auth === "number" || auth === null ? auth : auth.userId;
  const authFlow = typeof auth === "number" || auth === null ? "ui" : auth.flow;

  await logSecurityEvent(
    db,
    userId ?? null,
    "route_access",
    route,
    {
      securityLevel,
      authFlow,
      timestamp: new Date().toISOString(),
      ...(details ?? {}),
    },
    request,
    true,
  );
}
