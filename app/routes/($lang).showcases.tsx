import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang).showcases";

import { PageContext } from "~/features/showcases/context/page-context";
import {
  showcasesMiddleware,
  showcasesMiddlewareContext,
} from "~/features/showcases/middleware/showcases-middleware";
import { ContentShowcasePage } from "~/features/showcases/page";

export const middleware: MiddlewareFunction[] = [showcasesMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const showcasesContent = context.get(showcasesMiddlewareContext);
  return showcasesContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentShowcasePage />
    </PageContext.Provider>
  );
}
