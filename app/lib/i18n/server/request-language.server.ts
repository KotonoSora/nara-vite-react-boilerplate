import type { SupportedLanguage } from "../types/common";

import { DEFAULT_LANGUAGE } from "../constants/common";
import {
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
} from "../utils/config";

/**
 * Resolve the preferred language for a request using:
 * 1) URL segment, 2) cookie session, 3) Accept-Language header, 4) default
 */
export async function resolveRequestLanguage(
  request: Request,
): Promise<SupportedLanguage> {
  const url = new URL(request.url);

  // 1) Check URL segment
  const pathLanguage = getLanguageFromPath(url.pathname);
  if (pathLanguage) return pathLanguage;

  const { getLanguageSession } = await import(
    "~/lib/i18n/server/language.server"
  );

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
