import type { Route } from "./+types/home";

import HomePage from "~/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home Page" },
    { name: "description", content: "Home Page Demo!" },
  ];
}

export default function HomeDemo({}: Route.ComponentProps) {
  return <HomePage />;
}
