import { createCookieSessionStorage } from "react-router";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__nara_authentication",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: ["__nara_authentication"],
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });

/**
 * Creates a new user session by storing the user's ID in the session storage and returns a redirect response.
 *
 * @param userId - The unique identifier of the user to store in the session.
 * @param redirectTo - The URL to redirect the user to after the session is created.
 * @returns A `Response` object with a 302 redirect and the session cookie set.
 */
export async function createUserSession(userId: number, redirectTo: string) {
  const session = await getSession();
  session.set("userId", userId);
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * Retrieves the user session from the incoming HTTP request.
 *
 * @param request - The incoming HTTP request object.
 * @returns A promise that resolves to the user session obtained from the request's cookies.
 */
export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return await getSession(cookie);
}

/**
 * Retrieves the user ID from the session associated with the given request.
 *
 * @param request - The incoming HTTP request object.
 * @returns A promise that resolves to the user ID as a number if present in the session, or `null` if not found or not a number.
 */
export async function getUserId(request: Request): Promise<number | null> {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  return typeof userId === "number" ? userId : null;
}

/**
 * Ensures that a valid user ID is present in the given request.
 *
 * @param request - The incoming HTTP request object.
 * @returns A promise that resolves to the user ID if authenticated.
 * @throws {Response} Throws a 401 Unauthorized response if no user ID is found.
 */
export async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return userId;
}

/**
 * Logs out the current user by destroying their session and redirecting to the home page.
 *
 * @param request - The incoming HTTP request containing the user's session.
 * @returns A `Response` object that redirects the user to the root path ("/") and clears the session cookie.
 */
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await destroySession(session),
    },
  });
}
