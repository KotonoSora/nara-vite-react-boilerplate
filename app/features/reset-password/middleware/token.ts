import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

export type TokenPageContextType = {
  token: string;
};

export const { tokenMiddlewareContext } =
  createMiddlewareContext<TokenPageContextType>("tokenMiddlewareContext");

export const tokenMiddleware: MiddlewareFunction = async (
  { context, url },
  next,
) => {
  const token = url.searchParams.get("token");

  if (!token) {
    throw redirect("/forgot-password");
  }

  context.set(tokenMiddlewareContext, { token });

  return await next();
};
