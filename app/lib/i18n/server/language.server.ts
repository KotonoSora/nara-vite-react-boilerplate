import { createCookieSessionStorage } from "react-router";

import type { SupportedLanguage } from "../types/common";

import { DEFAULT_LANGUAGE } from "../constants/common";
import { isSupportedLanguage } from "../utils/common/is-supported-language";

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

/**
 * Retrieves and manages the language session for a given request.
 *
 * This function returns an object with methods to get, set, and commit the user's language preference
 * stored in the session. The language is validated against supported languages, and a default is used if invalid.
 *
 * @param request - The incoming HTTP request containing session cookies.
 * @returns An object with the following methods:
 * - `getLanguage`: Returns the current language from the session, or the default if not set or unsupported.
 * - `setLanguage`: Sets the language in the session.
 * - `commit`: Commits the session changes and returns the updated session cookie string.
 */
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
