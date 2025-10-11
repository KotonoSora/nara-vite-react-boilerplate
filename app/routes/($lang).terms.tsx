import type { Route } from "./+types/($lang).terms";

import type { MiddlewareFunction } from "react-router";

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

export default function TermsPage({}: Route.ComponentProps) {
  return <ContentTermsPage />;
}
