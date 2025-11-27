import type { Route } from "./+types/($lang).showcases.forest";

import { BACKGROUND_COLOR } from "~/features/showcases-forest/constants/ui";
import { ForestPage } from "~/features/showcases-forest/page";

import customStyle from "~/features/showcases-forest/styles/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: customStyle }];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forest Countdown" },
    { name: "description", content: "3D countdown timer showcase" },
    { name: "theme-color", content: BACKGROUND_COLOR },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return <ForestPage />;
}
