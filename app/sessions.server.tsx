import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__nara_boilerplate_theme",
    domain: import.meta.env.PROD ? import.meta.env.BASE_URL : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["nara_boilerplate_theme"],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
