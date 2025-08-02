import type { Route } from "./+types/($lang).showcase";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { PageContext } from "~/features/showcases/context/page-context";
import { ContentShowcasePage } from "~/features/showcases/page";
import { getLanguageSession } from "~/language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;

    // Get language from session
    const languageSession = await getLanguageSession(request);
    const language = languageSession.getLanguage();
    const t = createTranslationFunction(language);

    const { title, description, githubRepository } = await getPageInformation({
      ...env,
    } as any);
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

export function meta({ data }: Route.MetaArgs) {
  if (!data) return null;

  return [
    { title: `${(data as any).showcaseTitle || "Showcases"} - ${data.title}` },
    { name: "description", content: data.description },
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
