import { eq, and, gt, lt } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { randomBytes } from "crypto";

import * as schema from "~/database/schema";
import { logSecurityEvent } from "~/lib/auth/device-tracking.server";

const { session, user } = schema;

export type SessionData = typeof session.$inferSelect;

/**
 * Generate a secure session ID
 */
function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Get current session expiry time (30 days from now)
 */
function getSessionExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  return expiry;
}

/**
 * Create a new database session for a user
 */
export async function createDatabaseSession(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  }
): Promise<SessionData> {
  const sessionId = generateSessionId();
  const expiresAt = getSessionExpiry();

  const [newSession] = await db
    .insert(session)
    .values({
      id: sessionId,
      userId,
      expiresAt,
    })
    .returning();

  // Log session creation for security tracking
  if (metadata) {
    await logSecurityEvent(db, userId, "session_created", "session", metadata, {
      sessionId,
      expiresAt: expiresAt.toISOString(),
    });
  }

  return newSession;
}

/**
 * Get all active sessions for a user
 */
export async function getUserActiveSessions(
  db: DrizzleD1Database<typeof schema>,
  userId: number
): Promise<SessionData[]> {
  const now = new Date();
  
  return await db
    .select()
    .from(session)
    .where(
      and(
        eq(session.userId, userId),
        gt(session.expiresAt, now)
      )
    )
    .orderBy(session.createdAt);
}

/**
 * Validate if a session is still active and valid
 */
export async function validateSession(
  db: DrizzleD1Database<typeof schema>,
  sessionId: string
): Promise<{ valid: boolean; session?: SessionData; user?: typeof user.$inferSelect }> {
  const now = new Date();
  
  const result = await db
    .select({
      session: session,
      user: user,
    })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(
      and(
        eq(session.id, sessionId),
        gt(session.expiresAt, now)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return { valid: false };
  }

  return {
    valid: true,
    session: result[0].session,
    user: result[0].user,
  };
}

/**
 * Invalidate a specific session
 */
export async function invalidateSession(
  db: DrizzleD1Database<typeof schema>,
  sessionId: string,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  }
): Promise<boolean> {
  // Get session info for logging before deletion
  const sessionInfo = await db
    .select()
    .from(session)
    .where(eq(session.id, sessionId))
    .limit(1);

  const result = await db
    .delete(session)
    .where(eq(session.id, sessionId));

  // Log session invalidation
  if (sessionInfo.length > 0 && metadata) {
    await logSecurityEvent(
      db,
      sessionInfo[0].userId,
      "session_invalidated",
      "session",
      metadata,
      { sessionId }
    );
  }

  return (result as any)?.changes > 0 || (result as any)?.meta?.changes > 0;
}

/**
 * Invalidate all sessions for a user (sign out from all devices)
 */
export async function invalidateAllUserSessions(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  }
): Promise<number> {
  // Get count of sessions before deletion for logging
  const sessionsToDelete = await getUserActiveSessions(db, userId);
  const sessionCount = sessionsToDelete.length;

  // Delete all sessions for the user
  const result = await db
    .delete(session)
    .where(eq(session.userId, userId));

  // Log global logout
  if (metadata) {
    await logSecurityEvent(
      db,
      userId,
      "global_logout",
      "session",
      metadata,
      { 
        sessionCount,
        sessionIds: sessionsToDelete.map(s => s.id),
      }
    );
  }

  return sessionCount;
}

/**
 * Clean up expired sessions (should be run periodically)
 */
export async function cleanupExpiredSessions(
  db: DrizzleD1Database<typeof schema>
): Promise<number> {
  const now = new Date();
  
  const result = await db
    .delete(session)
    .where(lt(session.expiresAt, now));

  const deletedCount = (result as any)?.changes || (result as any)?.meta?.changes || 0;
  
  return deletedCount;
}

/**
 * Get session statistics for a user
 */
export async function getUserSessionStats(
  db: DrizzleD1Database<typeof schema>,
  userId: number
): Promise<{
  totalSessions: number;
  activeSessions: number;
  oldestSession?: Date;
  newestSession?: Date;
}> {
  const now = new Date();
  
  const allSessions = await db
    .select()
    .from(session)
    .where(eq(session.userId, userId))
    .orderBy(session.createdAt);

  const activeSessions = allSessions.filter(s => s.expiresAt > now);

  return {
    totalSessions: allSessions.length,
    activeSessions: activeSessions.length,
    oldestSession: allSessions[0]?.createdAt,
    newestSession: allSessions[allSessions.length - 1]?.createdAt,
  };
}

/**
 * Update session expiry (extend session)
 */
export async function updateSessionExpiry(
  db: DrizzleD1Database<typeof schema>,
  sessionId: string,
  newExpiry?: Date
): Promise<boolean> {
  const expiresAt = newExpiry || getSessionExpiry();
  
  const result = await db
    .update(session)
    .set({ expiresAt })
    .where(eq(session.id, sessionId));

  return (result as any)?.changes > 0 || (result as any)?.meta?.changes > 0;
}