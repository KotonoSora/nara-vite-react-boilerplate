import { useOutletContext } from "react-router";

import type { Route } from "./+types/($lang).showcase._index";

import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { PageContext } from "~/features/showcases/context/page-context";
import { ContentShowcasePage } from "~/features/showcases/page";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const { db } = context;
    const showcases = await getShowcases(db);

    return {
      showcases,
    } as {
      showcases: ProjectInfo[];
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Showcase" },
    { name: "description", content: "All project use NARA boilerplate" },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const outletContextData = useOutletContext();

  if (!loaderData) return null;

  const { showcases } = loaderData;
  const { openDetail, closeDetail } = outletContextData as {
    openDetail: Function;
    closeDetail: Function;
  };

  return (
    <PageContext.Provider value={{ showcases, openDetail, closeDetail }}>
      <ContentShowcasePage />
    </PageContext.Provider>
  );
}
