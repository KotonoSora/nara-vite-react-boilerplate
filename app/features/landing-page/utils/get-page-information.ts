const DEFAULT = {
  title: "NARA Boilerplate - Production-Ready React Starter",
  description:
    "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
  githubRepository: "https://github.com/KotonoSora/nara-vite-react-boilerplate",
};

export async function getPageInformation({
  LANDING_PAGE_TITLE,
  LANDING_PAGE_DESCRIPTION,
  LANDING_PAGE_REPOSITORY,
  LANDING_PAGE_COMMERCIAL_LINK,
}: LandingPageEnv) {
  return {
    title: LANDING_PAGE_TITLE ?? DEFAULT.title,
    description: LANDING_PAGE_DESCRIPTION ?? DEFAULT.description,
    githubRepository: LANDING_PAGE_REPOSITORY ?? DEFAULT.githubRepository,
    commercialLink: LANDING_PAGE_COMMERCIAL_LINK,
  };
}
