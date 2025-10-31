import { Outlet } from "react-router";

import type { Route } from "./+types/($lang).blog";

import { GeneralInformationContext } from "~/middleware/information";

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  return { ...generalInformation };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background content-visibility-auto flex flex-col">
      <Outlet />
    </main>
  );
}
