import { createContext } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { User } from "~/database/schema";

export type AuthContextType = {
  userId: string | null;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>();

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { getUserId } =
    await import("~/lib/authentication/server/authenticate.server");
  const { getUserById } =
    await import("~/lib/authentication/server/user.server");

  const { db } = context;
  const userId = await getUserId(request);
  const user = userId && db ? await getUserById(db, userId) : null;

  context.set(AuthContext, { userId, user });

  return await next();
};
