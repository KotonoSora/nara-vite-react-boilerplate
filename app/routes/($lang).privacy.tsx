import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).privacy";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { PageContext } from "~/features/legal/privacy/context/page-context";
import { ContentPrivacyPage } from "~/features/legal/privacy/page";
import { getTranslation } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const language: SupportedLanguage = await resolveRequestLanguage(request);

  // Get localized meta content
  const title = getTranslation(language, "legal.privacy.title");
  const description = getTranslation(language, "legal.privacy.description");

  const {
    cloudflare: { env },
  } = context;

  const { githubRepository } = (await getPageInformation(env as any)) || {};

  return {
    githubRepository,
    meta: {
      title,
      description,
    },
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.meta?.title || "Privacy Policy";
  const description =
    loaderData?.meta?.description ||
    "Privacy Policy for NARA - Modern React Boilerplate";

  return [
    { title: `${title} - NARA` },
    {
      name: "description",
      content: description,
    },
  ];
}
export default function PrivacyPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;
  const { githubRepository } = loaderData;

  return (
    <PageContext.Provider value={{ githubRepository }}>
      <ContentPrivacyPage />
    </PageContext.Provider>
  );
}
