import { data } from "react-router";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import { getUserId, requireUserId, requireAuth } from "~/auth.server";
import { verifyAPIToken } from "./api-tokens.server";
import { requireBasicAuth, requireBasicAuthForUI } from "./basic-auth.server";
import { hasPermission as checkUserPermission } from "./permissions.server";

/**
 * Authentication workflow types
 */
export type AuthFlow = "ui" | "api";

/**
 * Authentication result
 */
export interface AuthResult {
  user: typeof schema.user.$inferSelect;
  userId: number;
  flow: AuthFlow;
  tokenId?: number; // For API authentication
}

/**
 * Security level for different route types
 */
export type SecurityLevel = "standard" | "high" | "critical";

/**
 * Authentication options
 */
interface AuthOptions {
  flow?: AuthFlow;
  securityLevel?: SecurityLevel;
  requiredPermissions?: string[];
  basicAuthRealm?: string;
  redirectUrl?: string;
}

/**
 * Detect authentication flow based on request
 */
function detectAuthFlow(request: Request): AuthFlow {
  const contentType = request.headers.get("Content-Type");
  const accept = request.headers.get("Accept");
  const userAgent = request.headers.get("User-Agent");
  const authorization = request.headers.get("Authorization");

  // API flow indicators
  if (authorization?.startsWith("Bearer ")) {
    return "api";
  }

  if (contentType?.includes("application/json")) {
    return "api";
  }

  if (accept?.includes("application/json") && !accept.includes("text/html")) {
    return "api";
  }

  // Check for programmatic user agents
  if (userAgent && (
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("Postman") ||
    userAgent.includes("HTTPie") ||
    userAgent.includes("axios") ||
    userAgent.includes("fetch") ||
    !userAgent.includes("Mozilla")
  )) {
    return "api";
  }

  // Default to UI flow
  return "ui";
}

/**
 * API Authentication using JWT tokens
 */
async function authenticateAPI(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    throw data(
      { error: "Bearer token required" },
      { 
        status: 401,
        headers: {
          "WWW-Authenticate": "Bearer"
        }
      }
    );
  }

  const token = authHeader.slice(7);
  
  try {
    const result = await verifyAPIToken(db, token);
    if (!result) {
      throw new Error("Invalid token");
    }
    
    const { user, tokenId } = result;
    
    return {
      user,
      userId: user.id,
      flow: "api",
      tokenId,
    };
  } catch (error) {
    console.error("API authentication error:", error);
    throw data(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

/**
 * UI Authentication using sessions
 */
async function authenticateUI(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  redirectUrl: string = "/login"
): Promise<AuthResult> {
  try {
    const { user, userId } = await requireAuth(request, db);
    
    return {
      user,
      userId,
      flow: "ui",
    };
  } catch (error) {
    // Redirect to login for UI flow
    throw data(
      { error: "Authentication required" },
      { 
        status: 302,
        headers: {
          Location: redirectUrl,
        }
      }
    );
  }
}

/**
 * Apply security level requirements
 */
async function applySecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  authResult: AuthResult,
  securityLevel: SecurityLevel,
  basicAuthRealm?: string
): Promise<AuthResult> {
  if (securityLevel === "standard") {
    return authResult;
  }

  // High and critical security levels require basic auth
  if (securityLevel === "high" || securityLevel === "critical") {
    try {
      if (authResult.flow === "api") {
        // For API, require basic auth header
        await requireBasicAuth(request, db, basicAuthRealm);
      } else {
        // For UI, handle basic auth gracefully
        await requireBasicAuthForUI(request, db, { 
          realm: basicAuthRealm,
          redirectUrl: "/login"
        });
      }
    } catch (error) {
      // Re-throw the error (basic auth failed)
      throw error;
    }
  }

  // Critical level: additional checks could be added here
  if (securityLevel === "critical") {
    // Could add MFA requirement, IP restrictions, etc.
    // For now, basic auth is sufficient
  }

  return authResult;
}

/**
 * Check permissions after authentication
 */
async function checkPermissions(
  db: DrizzleD1Database<typeof schema>,
  authResult: AuthResult,
  requiredPermissions: string[]
): Promise<void> {
  if (requiredPermissions.length === 0) {
    return;
  }

  for (const permission of requiredPermissions) {
    const hasPermission = await checkUserPermission(db, authResult.userId, permission);
    
    if (!hasPermission) {
      throw data(
        { error: `Permission denied: ${permission}` },
        { status: 403 }
      );
    }
  }
}

/**
 * Comprehensive authentication middleware
 * Handles both UI and API flows with security levels and permissions
 */
export async function authenticate(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  options: AuthOptions = {}
): Promise<AuthResult> {
  const {
    flow = detectAuthFlow(request),
    securityLevel = "standard",
    requiredPermissions = [],
    basicAuthRealm = "Secure Area",
    redirectUrl = "/login",
  } = options;

  let authResult: AuthResult;

  // Authenticate based on flow
  if (flow === "api") {
    authResult = await authenticateAPI(request, db);
  } else {
    authResult = await authenticateUI(request, db, redirectUrl);
  }

  // Apply security level requirements
  authResult = await applySecurity(
    request,
    db,
    authResult,
    securityLevel,
    basicAuthRealm
  );

  // Check permissions
  await checkPermissions(db, authResult, requiredPermissions);

  return authResult;
}

/**
 * Convenience function for standard authentication
 */
export async function requireAuthentication(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<AuthResult> {
  return authenticate(request, db, { securityLevel: "standard" });
}

/**
 * Convenience function for high-security authentication
 */
export async function requireHighSecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  requiredPermissions: string[] = []
): Promise<AuthResult> {
  return authenticate(request, db, {
    securityLevel: "high",
    requiredPermissions,
  });
}

/**
 * Convenience function for critical security authentication
 */
export async function requireCriticalSecurity(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  requiredPermissions: string[] = []
): Promise<AuthResult> {
  return authenticate(request, db, {
    securityLevel: "critical",
    requiredPermissions,
  });
}

/**
 * Admin authentication with high security
 */
export async function requireAdmin(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<AuthResult> {
  return authenticate(request, db, {
    securityLevel: "high",
    requiredPermissions: ["admin.manage"],
  });
}

/**
 * Check if user is authenticated (no throwing)
 */
export async function isAuthenticated(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<AuthResult | null> {
  try {
    return await authenticate(request, db);
  } catch {
    return null;
  }
}

/**
 * Get authentication info without requiring it
 */
export async function getAuthInfo(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<AuthResult | null> {
  const flow = detectAuthFlow(request);
  
  try {
    if (flow === "api") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return null;
      }
      
      const token = authHeader.slice(7);
      const result = await verifyAPIToken(db, token);
      if (!result) {
        return null;
      }
      
      const { user, tokenId } = result;
      
      return {
        user,
        userId: user.id,
        flow: "api",
        tokenId,
      };
    } else {
      const userId = await getUserId(request);
      if (!userId) {
        return null;
      }
      
      const { getUserById } = await import("~/user.server");
      const user = await getUserById(db, userId);
      if (!user) {
        return null;
      }
      
      return {
        user,
        userId,
        flow: "ui",
      };
    }
  } catch {
    return null;
  }
}