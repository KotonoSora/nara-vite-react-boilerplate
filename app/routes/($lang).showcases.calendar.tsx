import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).showcases.calendar";

import type { MiddlewareFunction } from "react-router";

import {
  calendarMiddleware,
  calendarMiddlewareContext,
} from "~/features/showcases-calendar/middleware/calendar-middleware";
import { ContentCalendarInfinityPage } from "~/features/showcases-calendar/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [calendarMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const calendarContent = context.get(calendarMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...calendarContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page({}: Route.ComponentProps) {
  return <ContentCalendarInfinityPage />;
}
