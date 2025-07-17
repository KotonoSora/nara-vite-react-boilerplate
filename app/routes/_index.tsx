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

    return {
      title,
      description,
      githubRepository,
      commercialLink,
      showcases,
      steps,
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
