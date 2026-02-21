import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang).dashboard._index";

import type { MiddlewareFunction } from "react-router";

import {
  dashboardMiddleware,
  DashboardMiddlewareContext,
} from "~/features/dashboard/middleware/dashboard-middleware";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

// Lazy load the dashboard page to prevent @tanstack/react-table from being bundled in SSR
const ContentDashboardPage = lazy(() =>
  import("~/features/dashboard/page").then((module) => ({
    default: module.ContentDashboardPage,
  })),
);

export const middleware: MiddlewareFunction[] = [dashboardMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const dashboardContent = context.get(DashboardMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...dashboardContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Dashboard({}: Route.ComponentProps) {
  return <ContentDashboardPage />;
}
