import { data } from "react-router";

import type { Route } from "./+types/($lang).showcases";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { PageContext } from "~/features/showcases/context/page-context";
import { ContentShowcasePage } from "~/features/showcases/page";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ context, request }: Route.LoaderArgs) {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  try {
    const {
      cloudflare: { env },
      db,
    } = context;
    const { title, description, githubRepository } =
      (await getPageInformation(env as any)) || {};
    const showcases = await getShowcases(db);
    const showcaseTitle = t("showcase.title");

    return data({
      title,
      description,
      githubRepository,
      commercialLink: "",
      showcases,
      showcaseTitle,
    });
  } catch (error) {
    console.error(error);

    return data(
      { error: t("errors.common.somethingWentWrong") },
      { status: 500 },
    );
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Showcase" },
      {
        name: "description",
        content: "Showcase page for displaying featured projects",
      },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (!loaderData || "error" in loaderData) return null;

  const { githubRepository, commercialLink, showcases } = loaderData;

  return (
    <PageContext.Provider
      value={{
        githubRepository,
        commercialLink,
        showcases,
      }}
    >
      <ContentShowcasePage />
    </PageContext.Provider>
  );
}
