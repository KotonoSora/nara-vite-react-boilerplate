import { createContext } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { UserSchema } from "~/lib/auth/types/user";

export type AuthContextType = {
  userId: number | null;
  user: UserSchema | null;
};

export const AuthContext = createContext<AuthContextType>();

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { getUserId } = await import("~/lib/auth/server/auth.server");
  const { getUserById } = await import("~/lib/auth/server/user.server");

  const { db } = context;
  const userId = await getUserId(request);
  const user = userId && db ? await getUserById(db, userId) : null;
  context.set(AuthContext, { userId, user });
};
