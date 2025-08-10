import { eq, and, gt, or, isNull } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import { hashPassword } from "./config";

const { user, apiToken } = schema;

// Simple JWT implementation for API tokens
interface JWTHeader {
  alg: string;
  typ: string;
}

interface JWTPayload {
  sub: string; // user ID
  iat: number; // issued at
  exp?: number; // expiration
  scopes?: string[]; // allowed scopes
  tokenId: string; // reference to database token
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  str += "=".repeat((4 - (str.length % 4)) % 4);
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

// Simple HMAC-SHA256 implementation using Web Crypto API
async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

async function verify(data: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await sign(data, secret);
  return expectedSignature === signature;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function createJWT(payload: JWTPayload): Promise<string> {
  const header: JWTHeader = { alg: "HS256", typ: "JWT" };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(data, JWT_SECRET);
  
  return `${data}.${signature}`;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }
    
    const data = `${encodedHeader}.${encodedPayload}`;
    const isValid = await verify(data, signature, JWT_SECRET);
    
    if (!isValid) {
      return null;
    }
    
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export interface CreateAPITokenOptions {
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}

export interface APITokenInfo {
  id: number;
  name: string;
  token: string; // Only returned when creating
  scopes: string[];
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
}

/**
 * Create a new API token for a user
 */
export async function createAPIToken(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  options: CreateAPITokenOptions
): Promise<APITokenInfo> {
  const tokenId = crypto.randomUUID();
  const rawToken = `nara_${tokenId}_${Date.now()}`;
  const tokenHash = await hashPassword(rawToken);
  
  let expiresAt: Date | null = null;
  if (options.expiresInDays) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + options.expiresInDays);
  }
  
  const [newToken] = await db
    .insert(apiToken)
    .values({
      userId,
      name: options.name,
      tokenHash,
      expiresAt,
      scopes: JSON.stringify(options.scopes || []),
    })
    .returning();

  // Create JWT
  const jwtPayload: JWTPayload = {
    sub: userId.toString(),
    iat: Math.floor(Date.now() / 1000),
    exp: expiresAt ? Math.floor(expiresAt.getTime() / 1000) : undefined,
    scopes: options.scopes,
    tokenId: newToken.id.toString(),
  };
  
  const jwt = await createJWT(jwtPayload);
  
  return {
    id: newToken.id,
    name: newToken.name,
    token: jwt,
    scopes: options.scopes || [],
    expiresAt,
    lastUsedAt: null,
    createdAt: newToken.createdAt,
  };
}

/**
 * Verify and get user from API token
 */
export async function verifyAPIToken(
  db: DrizzleD1Database<typeof schema>,
  token: string
): Promise<{ user: typeof user.$inferSelect; tokenId: number; scopes: string[] } | null> {
  try {
    // Verify JWT
    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }
    
    const userId = parseInt(payload.sub);
    const tokenId = parseInt(payload.tokenId);
    
    // Check if token exists in database and is not expired
    const [tokenRecord] = await db
      .select()
      .from(apiToken)
      .where(
        and(
          eq(apiToken.id, tokenId),
          eq(apiToken.userId, userId),
          or(
            isNull(apiToken.expiresAt),
            gt(apiToken.expiresAt, new Date())
          )
        )
      )
      .limit(1);
    
    if (!tokenRecord) {
      return null;
    }
    
    // Get user
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    
    if (!userRecord) {
      return null;
    }
    
    // Update last used timestamp
    await db
      .update(apiToken)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiToken.id, tokenId));
    
    const scopes = tokenRecord.scopes ? JSON.parse(tokenRecord.scopes) : [];
    
    return {
      user: userRecord,
      tokenId: tokenRecord.id,
      scopes,
    };
  } catch {
    return null;
  }
}

/**
 * List all API tokens for a user (without token values)
 */
export async function getUserAPITokens(
  db: DrizzleD1Database<typeof schema>,
  userId: number
): Promise<Omit<APITokenInfo, "token">[]> {
  const tokens = await db
    .select({
      id: apiToken.id,
      name: apiToken.name,
      scopes: apiToken.scopes,
      expiresAt: apiToken.expiresAt,
      lastUsedAt: apiToken.lastUsedAt,
      createdAt: apiToken.createdAt,
    })
    .from(apiToken)
    .where(eq(apiToken.userId, userId))
    .orderBy(apiToken.createdAt);

  return tokens.map(token => ({
    id: token.id,
    name: token.name,
    scopes: token.scopes ? JSON.parse(token.scopes) : [],
    expiresAt: token.expiresAt,
    lastUsedAt: token.lastUsedAt,
    createdAt: token.createdAt,
  }));
}

/**
 * Revoke an API token
 */
export async function revokeAPIToken(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  tokenId: number
): Promise<boolean> {
  const result = await db
    .delete(apiToken)
    .where(
      and(
        eq(apiToken.id, tokenId),
        eq(apiToken.userId, userId)
      )
    );
  
  // In D1, we check if any rows were returned/affected differently
  return (result as any)?.changes > 0 || (result as any)?.meta?.changes > 0;
}

/**
 * Check if a token has a specific scope
 */
export function hasScope(tokenScopes: string[], requiredScope: string): boolean {
  return tokenScopes.includes(requiredScope) || tokenScopes.includes("*");
}

/**
 * Middleware for API authentication
 */
export function createAPIAuthenticator(db: DrizzleD1Database<typeof schema>) {
  return {
    async authenticate(request: Request): Promise<{
      user: typeof user.$inferSelect;
      scopes: string[];
    } | null> {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
      }
      
      const token = authHeader.substring(7);
      return await verifyAPIToken(db, token);
    },

    async requireAuth(request: Request): Promise<{
      user: typeof user.$inferSelect;
      scopes: string[];
    }> {
      const auth = await this.authenticate(request);
      if (!auth) {
        throw new Response("Unauthorized: Valid API token required", { status: 401 });
      }
      return auth;
    },

    async requireScope(request: Request, requiredScope: string): Promise<{
      user: typeof user.$inferSelect;
      scopes: string[];
    }> {
      const auth = await this.requireAuth(request);
      if (!hasScope(auth.scopes, requiredScope)) {
        throw new Response(`Forbidden: Required scope '${requiredScope}' not granted`, { status: 403 });
      }
      return auth;
    },
  };
}

// Common API scopes
export const API_SCOPES = {
  READ_PROFILE: "profile:read",
  WRITE_PROFILE: "profile:write",
  READ_USERS: "users:read",
  WRITE_USERS: "users:write",
  ADMIN: "admin:*",
  ALL: "*",
} as const;