import type { Route } from "./+types/($lang).showcases.forest";

import { ForestPage } from "~/features/showcases-forest/page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "" }, { name: "description", content: "" }];
}

export default function Page({}: Route.ComponentProps) {
  return <ForestPage />;
}
