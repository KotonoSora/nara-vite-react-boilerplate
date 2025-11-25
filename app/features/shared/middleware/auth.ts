import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { AuthContext } from "~/middleware/auth";

export const { userContext } = createMiddlewareContext("userContext");

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { user } = context.get(AuthContext);
  if (user) throw redirect("/dashboard");

  return await next();
};
