import type { Route } from "./+types/($lang).admin";

import type { MiddlewareFunction } from "react-router";

import {
  adminMiddleware,
  adminMiddlewareContext,
} from "~/features/admin/middleware/admin-middleware";
import { ContentAdminPage } from "~/features/admin/page";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [adminMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const adminContent = context.get(adminMiddlewareContext);
  return { ...generalInformation, ...adminContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  return <ContentAdminPage />;
}
