import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

// Theme session storage
const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__nara_theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["__nara_theme"],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const themeSessionResolver = createThemeSessionResolver(themeSessionStorage);

// User authentication session storage
const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__nara_session",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["__nara_auth_secret"],
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
