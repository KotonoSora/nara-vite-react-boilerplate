import { createCookieSessionStorage } from "react-router";

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

export async function createUserSession(userId: number, redirectTo: string) {
  const session = await authSessionStorage.getSession();
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

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await authSessionStorage.destroySession(session),
    },
  });
}

export async function requireAuth(request: Request, db: any) {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  
  // Import user functions to get user data
  const { getUserById } = await import("~/user.server");
  const user = await getUserById(db, userId);
  
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  
  return { user, userId };
}
