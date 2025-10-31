import type { Route } from "./+types/($lang).blog";

import { HomePage } from "~/features/blog/components/home-page";

export default function Page({}: Route.ComponentProps) {
  return <HomePage />;
}
