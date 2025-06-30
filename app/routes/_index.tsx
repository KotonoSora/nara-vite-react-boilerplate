import type { Route } from "./+types/_index";

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

    return {
      title,
      description,
      githubRepository,
      commercialLink,
      showcases,
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

  return <ContentPage {...loaderData} />;
}
