import { DEFAULT_LANGUAGE, isSupportedLanguage } from "@kotonosora/i18n";
import { createCookieSessionStorage } from "react-router";

import type { SupportedLanguage } from "@kotonosora/i18n";

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
  let detectedLanguage: SupportedLanguage = DEFAULT_LANGUAGE;
  const language = session.get("language");
  if (isSupportedLanguage(language)) {
    detectedLanguage = language;
  } else {
    // Try to detect from Accept-Language header (browser)
    const acceptLanguage = request.headers.get("Accept-Language");
    if (acceptLanguage) {
      // Parse Accept-Language header, e.g. "en-US,en;q=0.9,fr;q=0.8"
      const langs = acceptLanguage
        .split(",")
        .map((l) => l.split(";")[0].trim());
      const found = langs.find((l) => isSupportedLanguage(l.split("-")[0]));
      if (found) {
        detectedLanguage = found.split("-")[0] as SupportedLanguage;
      }
    }
    // Optionally, set the detected language in session for future requests
    session.set("language", detectedLanguage);
  }
  return {
    getLanguage(): SupportedLanguage {
      return detectedLanguage;
    },
    setLanguage(language: SupportedLanguage) {
      session.set("language", language);
      detectedLanguage = language;
    },
    commit() {
      return commitSession(session);
    },
  };
}
