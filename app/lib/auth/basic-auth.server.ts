import { data } from "react-router";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import { verifyPassword } from "./config";
import { getUserByEmail } from "~/user.server";

/**
 * Basic Authentication implementation for high-security routes
 * Provides an additional authentication layer before permission checks
 */

interface BasicAuthCredentials {
  username: string;
  password: string;
}

/**
 * Parse Basic Auth header
 */
function parseBasicAuthHeader(authHeader: string): BasicAuthCredentials | null {
  if (!authHeader.startsWith("Basic ")) {
    return null;
  }

  try {
    const credentials = atob(authHeader.slice(6));
    const [username, password] = credentials.split(":", 2);
    
    if (!username || !password) {
      return null;
    }

    return { username, password };
  } catch {
    return null;
  }
}

/**
 * Create Basic Auth challenge response
 */
function createBasicAuthChallenge(realm: string = "Secure Area"): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}"`,
      "Content-Type": "text/plain",
    },
  });
}

/**
 * Verify basic auth credentials against user database
 */
export async function verifyBasicAuth(
  db: DrizzleD1Database<typeof schema>,
  credentials: BasicAuthCredentials
): Promise<{ user: typeof schema.user.$inferSelect; userId: number } | null> {
  try {
    // Get user by email (username is email)
    const user = await getUserByEmail(db, credentials.username);
    if (!user || !user.passwordHash) {
      return null;
    }

    // Verify password
    const isValid = await verifyPassword(credentials.password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return { user, userId: user.id };
  } catch (error) {
    console.error("Basic auth verification error:", error);
    return null;
  }
}

/**
 * Basic authentication middleware for high-security routes
 */
export async function requireBasicAuth(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  realm: string = "Secure Area"
): Promise<{ user: typeof schema.user.$inferSelect; userId: number }> {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    throw createBasicAuthChallenge(realm);
  }

  const credentials = parseBasicAuthHeader(authHeader);
  if (!credentials) {
    throw createBasicAuthChallenge(realm);
  }

  const authResult = await verifyBasicAuth(db, credentials);
  if (!authResult) {
    throw createBasicAuthChallenge(realm);
  }

  return authResult;
}

/**
 * Basic auth middleware that can be used before permission checks
 * For UI routes that need extra security
 */
export async function requireBasicAuthForUI(
  request: Request,
  db: DrizzleD1Database<typeof schema>,
  options: {
    realm?: string;
    redirectUrl?: string;
  } = {}
): Promise<{ user: typeof schema.user.$inferSelect; userId: number }> {
  const { realm = "Secure Area", redirectUrl = "/login" } = options;
  
  try {
    return await requireBasicAuth(request, db, realm);
  } catch (response) {
    // For UI routes, redirect instead of showing basic auth prompt
    if (response instanceof Response && response.status === 401) {
      throw data(
        { error: "Additional authentication required" },
        { 
          status: 401,
          headers: {
            Location: redirectUrl,
          }
        }
      );
    }
    throw response;
  }
}

/**
 * Check if request has valid basic auth without throwing
 */
export async function hasValidBasicAuth(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<boolean> {
  try {
    await requireBasicAuth(request, db);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get basic auth user without throwing errors
 */
export async function getBasicAuthUser(
  request: Request,
  db: DrizzleD1Database<typeof schema>
): Promise<{ user: typeof schema.user.$inferSelect; userId: number } | null> {
  try {
    return await requireBasicAuth(request, db);
  } catch {
    return null;
  }
}