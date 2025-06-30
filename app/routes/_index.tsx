import type { Route } from "./+types/_index";

import ContentPage from "~/features/landing-page/page";

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare;

  const {
    LANDING_PAGE_TITLE,
    LANDING_PAGE_DESCRIPTION,
    LANDING_PAGE_REPOSITORY,
    LANDING_PAGE_COMMERCIAL_LINK,
  } = (
    env as {
      env: {
        LANDING_PAGE_TITLE?: string;
        LANDING_PAGE_DESCRIPTION?: string;
        LANDING_PAGE_REPOSITORY?: string;
        LANDING_PAGE_COMMERCIAL_LINK?: string;
      };
    }
  ).env;

  return {
    title:
      LANDING_PAGE_TITLE || "NARA Boilerplate - Production-Ready React Starter",
    description:
      LANDING_PAGE_DESCRIPTION ||
      "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
    githubRepository:
      LANDING_PAGE_REPOSITORY ||
      "https://github.com/KotonoSora/nara-vite-react-boilerplate",
    commercialLink: LANDING_PAGE_COMMERCIAL_LINK,
  };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "NARA Boilerplate - Production-Ready React Starter" },
    {
      name: "description",
      content:
        "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
    },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { githubRepository, commercialLink } = loaderData;

  return (
    <ContentPage
      githubRepository={githubRepository}
      commercialLink={commercialLink}
    />
  );
}
