import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang).about";

import {
  aboutMiddleware,
  aboutMiddlewareContext,
} from "~/features/about/middleware/about-middleware";
import { AboutPage } from "~/features/about/page";

export const middleware: MiddlewareFunction[] = [aboutMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const aboutContent = context.get(aboutMiddlewareContext);
  return aboutContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page() {
  return <AboutPage />;
}
