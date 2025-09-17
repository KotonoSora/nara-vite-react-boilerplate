import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang).dashboard";

import { PageContext } from "~/features/dashboard/context/page-context";
import {
  dashboardMiddleware,
  dashboardMiddlewareContext,
} from "~/features/dashboard/middleware/dashboard-middleware";
import { ContentDashboardPage } from "~/features/dashboard/page";

export const middleware: MiddlewareFunction[] = [dashboardMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const dashboardContent = context.get(dashboardMiddlewareContext);
  return dashboardContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title: title }, { name: "description", content: description }];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentDashboardPage />
    </PageContext.Provider>
  );
}
