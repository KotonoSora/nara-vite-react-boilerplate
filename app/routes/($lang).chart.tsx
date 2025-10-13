import type { Route } from "./+types/($lang).chart";

import { ContentChartPage } from "~/features/chart/page";
import { GeneralInformationContext } from "~/middleware/information";

export function loader({ context }: Route.LoaderArgs) {
  const pageInformation = context.get(GeneralInformationContext);
  return pageInformation;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentChartPage />;
}
