import { createContext } from "react-router";

import type { User } from "~/lib/auth/user.server";
import type { MiddlewareFunction } from "react-router";

import { getUserId } from "~/lib/auth/auth.server";
import { getUserById } from "~/lib/auth/user.server";

export type AuthContextType = {
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>();

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { db } = context;
  const userId = await getUserId(request);
  const user = userId && db ? await getUserById(db, userId) : null;
  context.set(AuthContext, { user });
};
