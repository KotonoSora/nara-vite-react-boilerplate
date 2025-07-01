import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__nara_theme",
    domain: import.meta.env.PROD ? "nara.local" : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["__nara_theme"],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
