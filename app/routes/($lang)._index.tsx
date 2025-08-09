import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang)._index";

import { PageContext } from "~/features/landing-page/context/page-context";
import { ContentPage } from "~/features/landing-page/page";
import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { getLanguageSession } from "~/language.server";
import {
  DEFAULT_LANGUAGE,
  detectLanguageFromAcceptLanguage,
  getLanguageFromPath,
} from "~/lib/i18n";
import { createTranslationFunction } from "~/lib/i18n/translations";

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;
    const url = new URL(request.url);

    // Detect language from URL, cookie, or browser preference
    const pathLanguage = getLanguageFromPath(url.pathname);
    const languageSession = await getLanguageSession(request);
    const cookieLanguage = languageSession.getLanguage();
    const acceptLanguage = detectLanguageFromAcceptLanguage(
      request.headers.get("Accept-Language") || "",
    );

    // Priority: URL > Cookie > Accept-Language > Default
    const language: SupportedLanguage =
      pathLanguage || cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE;

    const t = createTranslationFunction(language);

    const { title, description, githubRepository, commercialLink } =
      await getPageInformation({ ...env } as any);
    const showcases = await getShowcases(db);

    const steps: Step[] = [
      {
        number: 1,
        title: t("landing.gettingStarted.steps.clone.title"),
        description: t("landing.gettingStarted.steps.clone.description"),
        command: "npx degit KotonoSora/nara-vite-react-boilerplate#main my-app",
        note: t("landing.gettingStarted.steps.clone.note"),
      },
      {
        number: 2,
        title: t("landing.gettingStarted.steps.install.title"),
        description: t("landing.gettingStarted.steps.install.description"),
        command: "cd my-app && bun install",
        note: t("landing.gettingStarted.steps.install.note"),
      },
      {
        number: 3,
        title: t("landing.gettingStarted.steps.database.title"),
        description: t("landing.gettingStarted.steps.database.description"),
        command: "bun run db:migrate",
        note: t("landing.gettingStarted.steps.database.note"),
      },
      {
        number: 4,
        title: t("landing.gettingStarted.steps.start.title"),
        description: t("landing.gettingStarted.steps.start.description"),
        command: "bun run dev",
        note: t("landing.gettingStarted.steps.start.note"),
      },
    ];

    const featuresConfig: FeatureCardConfig[] = [
      {
        icon: "shield",
        title: t("landing.features.typeSafety.title"),
        description: t("landing.features.typeSafety.description"),
        colors: {
          primary: "blue-500",
          secondary: "blue-600",
          icon: "text-blue-600",
          hover: "group-hover:text-blue-600",
          background: "to-primary/5",
        },
      },
      {
        icon: "zap",
        title: t("landing.features.performance.title"),
        description: t("landing.features.performance.description"),
        colors: {
          primary: "yellow-500",
          secondary: "orange-500",
          icon: "text-yellow-600",
          hover: "group-hover:text-yellow-600",
          background: "to-yellow-500/5",
        },
      },
      {
        icon: "wrench",
        title: t("landing.features.developerErgonomics.title"),
        description: t("landing.features.developerErgonomics.description"),
        colors: {
          primary: "green-500",
          secondary: "emerald-500",
          icon: "text-green-600",
          hover: "group-hover:text-green-600",
          background: "to-green-500/5",
        },
      },
      {
        icon: "layers",
        title: t("landing.features.versatile.title"),
        description: t("landing.features.versatile.description"),
        colors: {
          primary: "purple-500",
          secondary: "pink-500",
          icon: "text-purple-600",
          hover: "group-hover:text-purple-600",
          background: "to-purple-500/5",
        },
      },
    ];

    return {
      title,
      description,
      githubRepository,
      commercialLink,
      showcases,
      steps,
      featuresConfig,
    } as PageInformation;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return null;

  return [
    { title: data.title },
    { name: "description", content: data.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;

  return (
    <PageContext.Provider value={loaderData}>
      <ContentPage />
    </PageContext.Provider>
  );
}
