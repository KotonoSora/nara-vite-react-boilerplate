import type { PUBLIC_ENV_FLAG } from "~/features/shared/types/type";

/**
 * Get the page information from the environment variables.
 *
 * @param params The environment variables.
 * @param params.VITE_LANDING_PAGE_TITLE The title of the landing page.
 * @param params.VITE_LANDING_PAGE_DESCRIPTION The description of the landing page.
 * @param params.VITE_LANDING_PAGE_REPOSITORY The GitHub repository link.
 * @param params.VITE_LANDING_PAGE_COMMERCIAL_LINK The commercial link.
 * @returns The page information.
 */
export function getGeneralInformation({
  VITE_LANDING_PAGE_TITLE,
  VITE_LANDING_PAGE_DESCRIPTION,
  VITE_LANDING_PAGE_REPOSITORY,
  VITE_LANDING_PAGE_COMMERCIAL_LINK,
}: PUBLIC_ENV_FLAG) {
  return {
    title: VITE_LANDING_PAGE_TITLE,
    description: VITE_LANDING_PAGE_DESCRIPTION,
    githubRepository: VITE_LANDING_PAGE_REPOSITORY,
    commercialLink: VITE_LANDING_PAGE_COMMERCIAL_LINK,
  };
}

export type GetPageInformation = ReturnType<typeof getGeneralInformation>;
