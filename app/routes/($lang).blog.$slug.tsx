import type { Route } from "./+types/($lang).blog";

import { SlugHydrateFallback } from "~/features/blog/components/slug-hydrate-fallback";
import { SlugPage } from "~/features/blog/components/slug-page";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  return {};
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <SlugHydrateFallback />;
}

export default function Page({}: Route.ComponentProps) {
  return <SlugPage />;
}
