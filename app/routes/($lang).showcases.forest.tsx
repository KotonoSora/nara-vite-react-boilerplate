import type { Route } from "./+types/($lang).showcases.forest";

import { ForestPage } from "~/features/showcases-forest/page";

export async function clientLoader() {
  return {};
}

clientLoader.hydrate = true as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forest Countdown" },
    { name: "description", content: "3D countdown timer showcase" },
  ];
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Page({}: Route.ComponentProps) {
  return <ForestPage />;
}
