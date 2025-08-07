import type { Route } from "./+types/($lang).roadmap";

import { RoadmapPage } from "~/features/roadmap/components/roadmap-page";
import { getRoadmapData, getRequestGuide } from "~/features/roadmap/utils/get-roadmap-data";
import { getLanguageSession } from "~/language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Get language from session
    const languageSession = await getLanguageSession(request);
    const language = languageSession.getLanguage();
    const t = createTranslationFunction(language);

    // Get roadmap data and request guide
    const roadmapData = getRoadmapData(t);
    const requestGuide = getRequestGuide(t);

    return {
      roadmapData,
      requestGuide,
    };
  } catch (error) {
    console.error("Error loading roadmap data:", error);
    throw new Response("Failed to load roadmap", { status: 500 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "Roadmap - NARA Boilerplate" },
      { name: "description", content: "Track our progress and see what's coming next in NARA Boilerplate." },
    ];
  }

  return [
    { title: "Roadmap - NARA Boilerplate" },
    { name: "description", content: "See what features are currently supported, what we're working on, and what's planned for the future." },
    { name: "keywords", content: "roadmap, features, development, react, typescript, cloudflare" },
  ];
}

export default function Roadmap({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Failed to Load Roadmap
          </h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't load the roadmap data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RoadmapPage 
      roadmapData={loaderData.roadmapData}
      requestGuide={loaderData.requestGuide}
    />
  );
}