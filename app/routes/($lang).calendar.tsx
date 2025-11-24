import type { Route } from "./+types/($lang).calendar";

import type { MiddlewareFunction } from "react-router";

import {
  calendarMiddleware,
  calendarMiddlewareContext,
} from "~/features/calendar/middleware/calendar-middleware";
import { ContentCalendarInfinityPage } from "~/features/calendar/page";
import { GeneralInformationContext } from "~/middleware/information";

import styleUrl from "~/features/calendar/style/custom.css?url";

export const middleware: MiddlewareFunction[] = [calendarMiddleware];

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const calendarContent = context.get(calendarMiddlewareContext);
  return { ...generalInformation, ...calendarContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentCalendarInfinityPage />;
}
