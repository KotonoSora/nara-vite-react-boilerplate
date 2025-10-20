import type { SupportedLanguage } from "../types/common";

import { DEFAULT_LANGUAGE } from "../constants/common";
import { detectLanguageFromAcceptLanguage } from "../utils/common/detect-language-from-accept-language";
import { getLanguageFromPath } from "../utils/common/get-language-from-path";

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
