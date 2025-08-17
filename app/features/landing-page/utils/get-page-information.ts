const DEFAULT = {
  title: "NARA Website Starter Kit — Modern, Flexible, Type-Safe Boilerplate",
  description:
    "A fast, opinionated starter template for building full-stack React apps powered by React Router v7, Cloudflare Workers, and modern tooling. Built with a focus on type safety, performance, and developer ergonomics.",
  githubRepository: "https://github.com/KotonoSora/nara-vite-react-boilerplate",
  commercialLink: "https://gum.co/u/otmfo1j8",
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
    commercialLink: LANDING_PAGE_COMMERCIAL_LINK ?? DEFAULT.commercialLink,
  };
}
