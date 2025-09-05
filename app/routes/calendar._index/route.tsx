import type { Route } from "./+types/route";

import { ContentCalendarInfinityPage } from "./page";
import styleUrl from "./style/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calendar Infinity" },
    { name: "description", content: "Demo calendar app" },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentCalendarInfinityPage />;
}
