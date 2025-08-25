import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).about";

import { DarkAbout } from "~/features/about/components/dark-edgy";
import { NewspaperAbout } from "~/features/about/components/newspaper-about";
import { PlayfulAbout } from "~/features/about/components/playful-about";
import { ShadcnAbout } from "~/features/about/components/shadcn-about";
import { TechAbout } from "~/features/about/components/tech-about";
import { MinimalistAbout } from "~/features/about/components/ultra-minimalist";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request }: Route.LoaderArgs) {
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  return {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
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
      { title: "About Us" },
      {
        name: "description",
        content: "Learn more about our company and team.",
      },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <div className="min-h-screen relative">
      {/* Debug Indicator */}
      <div className="fixed top-0 right-0 z-50">
        <div className="relative">
          <div className="absolute top-3 right-[-45px] rotate-45 bg-red-600 text-white text-xs font-bold px-12 py-1 shadow-lg">
            DEBUG
          </div>
        </div>
      </div>

      {/* This page is demo style of about page. You can create your own style */}
      <MinimalistAbout />
      <DarkAbout />
      <PlayfulAbout />
      <NewspaperAbout />
      <TechAbout />
      <ShadcnAbout />
    </div>
  );
}
