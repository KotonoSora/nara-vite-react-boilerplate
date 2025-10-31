import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

export const { slugBlogMiddlewareContext } = createMiddlewareContext<any>(
  "slugBlogMiddlewareContext",
);

export const slugBlogMiddleware: MiddlewareFunction = async ({ context }) => {
  const contextValue: any = {
    content: <div>content load form middleware</div>,
  };

  context.set(slugBlogMiddlewareContext, contextValue);
};
