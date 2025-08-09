import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).privacy";

import { PageContext } from "~/features/legal/privacy/context/page-context";
import { ContentPrivacyPage } from "~/features/legal/privacy/page";
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
  const title = getTranslation(language, "legal.privacy.title");
  const description = getTranslation(language, "legal.privacy.description");

  return {
    meta: {
      title,
      description,
    },
  };
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.meta?.title || "Privacy Policy";
  const description =
    data?.meta?.description ||
    "Privacy Policy for NARA - Modern React Boilerplate";

  return [
    { title: `${title} - NARA` },
    {
      name: "description",
      content: description,
    },
  ];
}
export default function PrivacyPage({}: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{}}>
      <ContentPrivacyPage />
    </PageContext.Provider>
  );
}
