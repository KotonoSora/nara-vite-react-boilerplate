import type { Route } from "./+types/($lang)._index";

import type { MiddlewareFunction } from "react-router";

import {
  pageMiddleware,
  pageMiddlewareContext,
} from "~/features/landing-page/middleware/page-middleware";
import { ContentPage } from "~/features/landing-page/page";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [pageMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const pageContent = context.get(pageMiddlewareContext);
  return { ...generalInformation, ...pageContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentPage />;
}
