import type { Route } from "./+types/showcase";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { PageContext } from "~/features/showcases/context/page-context";
import { ContentShowcasePage } from "~/features/showcases/page";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const {
      cloudflare: { env },
      db,
    } = context;
    const { title, description, githubRepository } = await getPageInformation({
      ...env,
    } as any);
    const showcases = await getShowcases(db);

    return {
      title,
      description,
      githubRepository,
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
    { title: `Showcases - ${data.title}` },
    { name: "description", content: data.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;

  return (
    <PageContext.Provider value={loaderData}>
      <ContentShowcasePage />
    </PageContext.Provider>
  );
}
