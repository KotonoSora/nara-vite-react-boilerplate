import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

export const { userContext } = createMiddlewareContext("userContext");

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { getUserId } = await import("~/lib/auth/auth.server");

  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }

  return await next();
};
