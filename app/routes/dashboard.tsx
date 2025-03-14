import type { Route } from "./+types/dashboard";

import { Dashboard } from "~/dashboard/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Demo" },
    { name: "description", content: "Dashboard Demo Screen!" },
  ];
}

export default function DashboardDemo({}: Route.ComponentProps) {
  return <Dashboard />;
}
