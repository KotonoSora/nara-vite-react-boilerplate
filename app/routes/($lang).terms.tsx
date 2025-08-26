import type { Route } from "./+types/($lang).terms";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { PageContext } from "~/features/terms/context/page-context";
import { ContentTermsPage } from "~/features/terms/page";
import { createTranslationFunction } from "~/lib/i18n";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const title = t("legal.terms.title");
  const description = t("legal.terms.description");

  const { githubRepository } =
    (await getPageInformation(import.meta.env as any)) || {};

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
