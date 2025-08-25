import type { PageInformation } from "~/features/landing-page/types/type";
import type { Route } from "./+types/($lang).showcases";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { PageContext } from "~/features/showcases/context/page-context";
import { ContentShowcasePage } from "~/features/showcases/page";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;

    const language = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);

    const { title, description, githubRepository } =
      (await getPageInformation(env as any)) || {};
    const showcases = await getShowcases(db);

    const showcaseTitle = t("showcase.title");

    return {
      title,
      description,
      githubRepository,
      commercialLink: "",
      showcases,
      steps: [],
      featuresConfig: [],
      showcaseTitle,
    } as PageInformation;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !loaderData ||
    (loaderData && (!loaderData.title || !loaderData.description))
  ) {
    return [
      {
        title: "Showcase",
      },
      {
        name: "description",
        content: "Showcase page for displaying featured projects",
      },
    ];
  }

  return [
    {
      title: loaderData.title,
    },
    { name: "description", content: loaderData.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;

  return (
    <PageContext.Provider value={loaderData}>
      <ContentShowcasePage />
    </PageContext.Provider>
  );
}
