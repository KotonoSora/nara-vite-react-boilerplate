import type { Route } from "./+types/($lang).dashboard";

import type { MiddlewareFunction } from "react-router";

import {
  dashboardMiddleware,
  dashboardMiddlewareContext,
} from "~/features/dashboard/middleware/dashboard-middleware";
import { ContentDashboardPage } from "~/features/dashboard/page";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [dashboardMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const dashboardContent = context.get(dashboardMiddlewareContext);
  return { ...generalInformation, ...dashboardContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Dashboard({}: Route.ComponentProps) {
  return <ContentDashboardPage />;
}
