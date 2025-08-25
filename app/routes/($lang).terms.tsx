import type { Route } from "./+types/($lang).terms";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { PageContext } from "~/features/terms/context/page-context";
import { ContentTermsPage } from "~/features/terms/page";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const title = t("legal.terms.title");
  const description = t("legal.terms.description");

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
      { title: "Terms of Service" },
      {
        name: "description",
        content: "Terms of Service",
      },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function TermsPage({ loaderData }: Route.ComponentProps) {
  const { githubRepository } = loaderData;

  return (
    <PageContext.Provider value={{ githubRepository }}>
      <ContentTermsPage />
    </PageContext.Provider>
  );
}
