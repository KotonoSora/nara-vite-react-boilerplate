import type { Route } from "./+types/($lang).privacy";

import type { MiddlewareFunction } from "react-router";

import {
  privacyMiddleware,
  privacyMiddlewareContext,
} from "~/features/privacy/middleware/page-middleware";
import { ContentPrivacyPage } from "~/features/privacy/page";

export const middleware: MiddlewareFunction[] = [privacyMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const privacyContent = context.get(privacyMiddlewareContext);
  return privacyContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}
export default function PrivacyPage({ loaderData }: Route.ComponentProps) {
  return <ContentPrivacyPage />;
}
