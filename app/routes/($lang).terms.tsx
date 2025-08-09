import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).terms";

import { PageContext } from "~/features/legal/terms/context/page-context";
import { ContentTermsPage } from "~/features/legal/terms/page";
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
  getTranslation,
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

  // Get localized meta content
  const title = getTranslation(language, "legal.terms.title");
  const description = getTranslation(language, "legal.terms.description");

  return {
    meta: {
      title,
      description,
    },
  };
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.meta?.title || "Terms of Service";
  const description =
    data?.meta?.description ||
    "Terms of Service for NARA - Modern React Boilerplate";

  return [
    { title: `${title} - NARA` },
    {
      name: "description",
      content: description,
    },
  ];
}
export default function TermsPage({}: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{}}>
      <ContentTermsPage />
    </PageContext.Provider>
  );
}
