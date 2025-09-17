import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang).admin";

import { PageContext } from "~/features/admin/context/page-context";
import {
  adminMiddleware,
  adminMiddlewareContext,
} from "~/features/admin/middleware/admin-middleware";
import { ContentAdminPage } from "~/features/admin/page";

export const middleware: MiddlewareFunction[] = [adminMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const adminContent = context.get(adminMiddlewareContext);
  return adminContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentAdminPage />
    </PageContext.Provider>
  );
}
