import type { Route } from "./+types/($lang).showcases.calendar";

import type { MiddlewareFunction } from "react-router";

import {
  calendarMiddleware,
  calendarMiddlewareContext,
} from "~/features/showcases-calendar/middleware/calendar-middleware";
import { ContentCalendarInfinityPage } from "~/features/showcases-calendar/page";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [calendarMiddleware];

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
