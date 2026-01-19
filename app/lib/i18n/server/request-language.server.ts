import {
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
} from "@kotonosora/i18n";
import { DEFAULT_LANGUAGE } from "@kotonosora/i18n-locales";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";

/**
 * Resolves the preferred language for a given HTTP request.
 *
 * The resolution follows these steps in order:
 * 1. Checks the URL path segment for a supported language.
 * 2. Checks the language stored in the cookie session.
 * 3. Checks the `Accept-Language` header from the request.
 * 4. Falls back to the default language if none of the above are found.
 *
 * @param request - The incoming HTTP request object.
 * @returns A promise that resolves to the detected supported language.
 */
export async function resolveRequestLanguage(
  request: Request,
): Promise<SupportedLanguage> {
  const url = new URL(request.url);

  // 1) Check URL segment
  const pathLanguage = getLanguageFromPath(url.pathname);
  if (pathLanguage) return pathLanguage;

  const { getLanguageSession } = await import("./language.server");

  // 2) Check cookie session
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  if (cookieLanguage) return cookieLanguage;

  // 3) Check Accept-Language header
  const acceptLanguage = detectLanguageFromAcceptLanguage(
    request.headers.get("Accept-Language") || "",
  );
  if (acceptLanguage) return acceptLanguage;

  // 4) Fallback
  return DEFAULT_LANGUAGE;
}
