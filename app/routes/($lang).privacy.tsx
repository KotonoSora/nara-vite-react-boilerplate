import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).privacy";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { PageContext } from "~/features/privacy/context/page-context";
import { ContentPrivacyPage } from "~/features/privacy/page";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const title = t("legal.privacy.title");
  const description = t("legal.privacy.description");

  const {
    cloudflare: { env },
  } = context;

  const { githubRepository } = (await getPageInformation(env as any)) || {};

  return {
    title,
    description,
    githubRepository,
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Privacy Policy" },
      { name: "description", content: "Privacy Policy" },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}
export default function PrivacyPage({ loaderData }: Route.ComponentProps) {
  const { githubRepository } = loaderData;

  return (
    <PageContext.Provider value={{ githubRepository }}>
      <ContentPrivacyPage />
    </PageContext.Provider>
  );
}
