import type { Route } from "./+types/($lang).showcases";

import type { MiddlewareFunction } from "react-router";

import {
  showcasesMiddleware,
  showcasesMiddlewareContext,
} from "~/features/showcases/middleware/showcases-middleware";
import { ContentShowcasePage } from "~/features/showcases/page";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [showcasesMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const showcasesContent = context.get(showcasesMiddlewareContext);
  return { ...generalInformation, ...showcasesContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentShowcasePage />;
}
