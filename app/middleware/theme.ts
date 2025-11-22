import { createContext } from "react-router";
import { Theme } from "remix-themes";

import type { MiddlewareFunction } from "react-router";

export type ThemeContextType = {
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContextType>();

export const themeMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { themeSessionResolver } = await import("~/lib/theme/sessions.server");

  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme();
  context.set(ThemeContext, { theme: theme || Theme.LIGHT });
  return await next();
};
