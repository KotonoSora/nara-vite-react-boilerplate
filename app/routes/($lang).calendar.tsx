import type { Route } from "./+types/($lang).calendar";

import { ContentCalendarInfinityPage } from "~/features/calendar/page";
import { GeneralInformationContext } from "~/middleware/information";

import styleUrl from "~/features/calendar/style/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export function loader({ context }: Route.LoaderArgs) {
  const pageInformation = context.get(GeneralInformationContext);
  return pageInformation;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentCalendarInfinityPage />;
}
