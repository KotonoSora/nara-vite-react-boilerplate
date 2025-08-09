import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).privacy";

import { PageContext } from "~/features/privacy/context/page-context";
import { ContentPrivacyPage } from "~/features/privacy/page";
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
    { title: "Privacy Policy - NARA" },
    {
      name: "description",
      content: "Privacy Policy for NARA - Modern React Boilerplate",
    },
  ];
}

export default function PrivacyPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentPrivacyPage />
    </PageContext.Provider>
  );
}
