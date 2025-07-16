import type { Route } from "./+types/dashboard";
import { DashboardPage } from "~/features/dashboard/page";

export function meta() {
  return [
    { title: "Dashboard - NARA" },
    { name: "description", content: "Manage your subscriptions and purchases." },
  ];
}

export default function Route() {
  return <DashboardPage />;
}