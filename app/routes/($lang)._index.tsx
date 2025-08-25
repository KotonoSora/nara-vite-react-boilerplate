import { data } from "react-router";

import type {
  FeatureCardConfig,
  Step,
} from "~/features/landing-page/types/type";
import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang)._index";

import { PageContext } from "~/features/landing-page/context/page-context";
import { ContentPage } from "~/features/landing-page/page";
import { getFeaturesConfigs } from "~/features/landing-page/utils/get-features-configs";
import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { getSteps } from "~/features/landing-page/utils/get-steps";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;
    const language: SupportedLanguage = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);
    const { title, description, githubRepository, commercialLink } =
      (await getPageInformation(env as any)) || {};
    const showcases = await getShowcases(db);
    const steps: Step[] = getSteps(t);
    const featuresConfig: FeatureCardConfig[] = getFeaturesConfigs(t);

    return data({
      title,
      description,
      githubRepository,
      commercialLink,
      showcases,
      steps,
      featuresConfig,
    });
  } catch (error) {
    console.error("Landing page error:", error);

    return data({ error: "Failed to load page data" }, { status: 500 });
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!("title" in loaderData) || !("description" in loaderData)) {
    return [
      {
        title:
          "NARA Website Starter Kit — Modern, Flexible, Type-Safe Boilerplate",
      },
      {
        name: "description",
        content:
          "A fast, opinionated starter template for building full-stack React apps powered by React Router v7, Cloudflare Workers, and modern tooling. Built with a focus on type safety, performance, and developer ergonomics.",
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

  const {
    title,
    description,
    githubRepository,
    commercialLink,
    showcases,
    steps,
    featuresConfig,
  } = loaderData;

  return (
    <PageContext.Provider
      value={{
        title,
        description,
        githubRepository,
        commercialLink,
        showcases,
        steps,
        featuresConfig,
      }}
    >
      <ContentPage />
    </PageContext.Provider>
  );
}
