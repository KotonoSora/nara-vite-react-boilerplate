import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).terms";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { PageContext } from "~/features/legal/terms/context/page-context";
import { ContentTermsPage } from "~/features/legal/terms/page";
import { getTranslation } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const language: SupportedLanguage = await resolveRequestLanguage(request);

  // Get localized meta content
  const title = getTranslation(language, "legal.terms.title");
  const description = getTranslation(language, "legal.terms.description");

  const {
    cloudflare: { env },
  } = context;

  const { githubRepository } = await getPageInformation({ ...env } as any);

  return {
    githubRepository,
    meta: {
      title,
      description,
    },
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.meta?.title || "Terms of Service";
  const description =
    loaderData?.meta?.description ||
    "Terms of Service for NARA - Modern React Boilerplate";

  return [
    { title: `${title} - NARA` },
    {
      name: "description",
      content: description,
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
