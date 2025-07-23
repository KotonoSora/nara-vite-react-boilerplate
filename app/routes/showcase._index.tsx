import type { Route } from "./+types/showcase";

import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { PageContext } from "~/features/showcases/context/page-context";
import { ContentShowcasePage } from "~/features/showcases/page";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const { db } = context;
    const showcases = await getShowcases(db);

    return {
      showcases: showcases || [],
    } as {
      showcases: ProjectInfo[];
    };
  } catch (error) {
    console.error(error);
    return {
      showcases: [],
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Showcase" },
    { name: "description", content: "All project use NARA boilerplate" },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { showcases } = loaderData!;

  return (
    <PageContext.Provider value={{ showcases }}>
      <ContentShowcasePage />
    </PageContext.Provider>
  );
}
