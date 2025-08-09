import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).terms";

import { PageContext } from "~/features/terms/context/page-context";
import { ContentTermsPage } from "~/features/terms/page";
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
} from "~/lib/i18n";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Detect language from URL, cookie, or browser preference
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const acceptLanguage = detectLanguageFromAcceptLanguage(
    request.headers.get("Accept-Language") || "",
  );

  // Priority: URL > Cookie > Accept-Language > Default
  const language: SupportedLanguage =
    pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;

  return {
    language,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service - NARA" },
    {
      name: "description",
      content: "Terms of Service for NARA - Modern React Boilerplate",
    },
  ];
}

export default function TermsPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentTermsPage />
    </PageContext.Provider>
  );
}
