/**
 * Get the page information from the environment variables.
 *
 * @param params The environment variables.
 * @param params.LANDING_PAGE_TITLE The title of the landing page.
 * @param params.LANDING_PAGE_DESCRIPTION The description of the landing page.
 * @param params.LANDING_PAGE_REPOSITORY The GitHub repository link.
 * @param params.LANDING_PAGE_COMMERCIAL_LINK The commercial link.
 * @returns The page information.
 */
export async function getPageInformation({
  LANDING_PAGE_TITLE,
  LANDING_PAGE_DESCRIPTION,
  LANDING_PAGE_REPOSITORY,
  LANDING_PAGE_COMMERCIAL_LINK,
}: LandingPageEnv) {
  return {
    title: LANDING_PAGE_TITLE,
    description: LANDING_PAGE_DESCRIPTION,
    githubRepository: LANDING_PAGE_REPOSITORY,
    commercialLink: LANDING_PAGE_COMMERCIAL_LINK,
  };
}
