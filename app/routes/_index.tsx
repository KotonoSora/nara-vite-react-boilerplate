import type { Route } from "./+types/_index";

import ContentPage from "~/features/landing-page/page";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;

    const response = await fetch(`${origin}/api/landing-page`);
    if (!response.ok) {
      throw new Error(`Failed to fetch currencies: ${response.statusText}`);
    }

    const pageInformationData: PageInformation = await response.json();

    return pageInformationData;
  } catch (error) {
    return null;
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return null;

  return [
    { title: data.title },
    { name: "description", content: data.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;

  return <ContentPage {...loaderData} />;
}
