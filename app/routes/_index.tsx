import type { Route } from "./+types/_index";

import { PageContext } from "~/features/landing-page/context/page-context";
import { ContentPage } from "~/features/landing-page/page";
import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;

    const { title, description, githubRepository, commercialLink } =
      await getPageInformation({ ...env } as any);
    const showcases = await getShowcases(db);

    const steps: Step[] = [
      {
        number: 1,
        title: "Clone the Repository",
        description: "Get the latest version of NARA boilerplate",
        command: "npx degit KotonoSora/nara-vite-react-boilerplate#main my-app",
        note: "Replace 'my-app' with your project name",
      },
      {
        number: 2,
        title: "Install Dependencies",
        description: "Use your preferred package manager",
        command: "cd my-app && bun install",
        note: "Package manager only supports Bun for now",
      },
      {
        number: 3,
        title: "Set Up Database",
        description: "Initialize the local database",
        command: "bun run db:migrate",
        note: "Creates the SQLite database for development",
      },
      {
        number: 4,
        title: "Start Development",
        description: "Launch the development server",
        command: "bun run dev",
        note: "Your app will be available at http://localhost:5173",
      },
    ];

    const featuresConfig: FeatureCardConfig[] = [
      {
        icon: "shield",
        title: "Type Safety",
        description:
          "End-to-end TypeScript coverage with proper route typing and strict type checking throughout the entire stack.",
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
        title: "Performance",
        description:
          "Modern tooling with Vite and Bun for lightning-fast builds, plus Cloudflare edge deployment for global performance.",
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
        title: "Developer Ergonomics",
        description:
          "Opinionated setup that just works. Pre-configured tooling, testing, and development environment for maximum productivity.",
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
        title: "Versatile",
        description:
          "Flexible architecture designed to fit the majority of project ideas, from MVPs to production applications.",
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
