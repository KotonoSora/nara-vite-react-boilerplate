import { createCookieSessionStorage } from "react-router";

import type { SupportedLanguage } from "../types/common";

import { DEFAULT_LANGUAGE } from "../constants/common";
import { isSupportedLanguage } from "../utils/config";

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__nara_language",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["__nara_language"],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function getLanguageSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return {
    getLanguage(): SupportedLanguage {
      const language = session.get("language");
      return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
    },
    setLanguage(language: SupportedLanguage) {
      session.set("language", language);
    },
    commit() {
      return commitSession(session);
    },
  };
}
