import type { Route } from "./+types/($lang).showcases.forest";

import type { MiddlewareFunction } from "react-router";

import { BACKGROUND_COLOR } from "~/features/showcases-forest/constants/ui";
import {
  forestMiddleware,
  forestMiddlewareContext,
} from "~/features/showcases-forest/middleware/forest-middleware";
import { ForestPage } from "~/features/showcases-forest/page";
import { GeneralInformationContext } from "~/middleware/information";

import customStyle from "~/features/showcases-forest/styles/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: customStyle }];
}

export const middleware: MiddlewareFunction[] = [forestMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const forestContent = context.get(forestMiddlewareContext);
  return { ...generalInformation, ...forestContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: BACKGROUND_COLOR },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return <ForestPage />;
}
