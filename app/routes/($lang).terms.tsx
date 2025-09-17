import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang).terms";

import { PageContext } from "~/features/terms/context/page-context";
import {
  termsMiddleware,
  termsMiddlewareContext,
} from "~/features/terms/middleware/terms-middleware";
import { ContentTermsPage } from "~/features/terms/page";

export const middleware: MiddlewareFunction[] = [termsMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const termsContent = context.get(termsMiddlewareContext);
  return termsContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function TermsPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentTermsPage />
    </PageContext.Provider>
  );
}
