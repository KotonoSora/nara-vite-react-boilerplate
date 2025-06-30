import type { Route } from "./+types/_index";

import ContentPage from "~/features/landing-page/page";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;

    const {
      LANDING_PAGE_TITLE,
      LANDING_PAGE_DESCRIPTION,
      LANDING_PAGE_REPOSITORY,
      LANDING_PAGE_COMMERCIAL_LINK,
    } = env as LandingPageEnv;

    const responseShowcases = await getShowcases(db);

    const pageInformationData: PageInformation = {
      title:
        LANDING_PAGE_TITLE ||
        "NARA Boilerplate - Production-Ready React Starter",
      description:
        LANDING_PAGE_DESCRIPTION ||
        "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
      githubRepository:
        LANDING_PAGE_REPOSITORY ||
        "https://github.com/KotonoSora/nara-vite-react-boilerplate",
      commercialLink: LANDING_PAGE_COMMERCIAL_LINK,
      showcases: responseShowcases,
    };

    return pageInformationData;
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

  return <ContentPage {...loaderData} />;
}
