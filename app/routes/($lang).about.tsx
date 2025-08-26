import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).about";

import { AboutPage } from "~/features/about/page";
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
  return <AboutPage />;
}
