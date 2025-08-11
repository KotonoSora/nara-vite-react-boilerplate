import { createCookieSessionStorage } from "react-router";

import {
  createDatabaseSession,
  invalidateAllUserSessions,
  invalidateSession,
  validateSession,
} from "~/lib/auth/session-manager.server";

const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__nara_auth",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["__nara_auth"],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function createUserSession(
  userId: number,
  redirectTo: string,
  db?: any,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  },
) {
  const session = await authSessionStorage.getSession();

  // Create database session if db is provided
  let dbSession = null;
  if (db) {
    dbSession = await createDatabaseSession(db, userId, metadata);
    session.set("sessionId", dbSession.id);
  }

  session.set("userId", userId);
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return await authSessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<number | null> {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  return typeof userId === "number" ? userId : null;
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return userId;
}

export async function logout(
  request: Request,
  db?: any,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  },
) {
  const session = await getUserSession(request);
  const sessionId = session.get("sessionId");

  // Invalidate database session if it exists
  if (sessionId && db) {
    await invalidateSession(db, sessionId, metadata);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await authSessionStorage.destroySession(session),
    },
  });
}

export async function logoutFromAllSessions(
  request: Request,
  db: any,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  },
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // Invalidate all database sessions for the user
  await invalidateAllUserSessions(db, userId, metadata);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await authSessionStorage.destroySession(session),
    },
  });
}

export async function requireAuth(request: Request, db: any) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  const sessionId = session.get("sessionId");

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // If we have a sessionId, validate it in the database
  if (sessionId && db) {
    const sessionValidation = await validateSession(db, sessionId);
    if (!sessionValidation.valid) {
      // Session is invalid, force logout
      throw await logout(request, db);
    }

    return {
      user: sessionValidation.user!,
      userId,
      sessionId,
    };
  }

  // Fallback to legacy session validation
  const { getUserById } = await import("~/user.server");
  const user = await getUserById(db, userId);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user, userId, sessionId: null };
}
