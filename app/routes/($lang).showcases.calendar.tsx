import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang).showcases.calendar";

import type { MiddlewareFunction } from "react-router";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import {
  calendarMiddleware,
  calendarMiddlewareContext,
} from "~/features/showcases-calendar/middleware/calendar-middleware";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

// Lazy load the calendar to prevent react-virtuoso from being bundled in SSR
const ContentCalendarInfinityPage = lazy(() =>
  import("@kotonosora/calendar").then((module) => ({
    default: module.ContentCalendarInfinityPage,
  })),
);

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
  return (
    <main className="min-h-svh bg-background content-visibility-auto">
      {/* Header navigation */}
      <HeaderNavigation />

      <ContentCalendarInfinityPage />

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
