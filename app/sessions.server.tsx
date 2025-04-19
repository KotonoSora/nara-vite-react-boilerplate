import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__nara_boilerplate_theme",
    domain: isProduction ? process.env.DOMAIN : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["nara_boilerplate_theme"],
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
