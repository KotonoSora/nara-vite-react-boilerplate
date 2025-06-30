import type { Route } from "./+types/_index";

import ContentPage from "~/features/landing-page/page";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;

    console.log({
      request,
      params,
      context,
      url,
      origin,
      api: `${origin}/api/landing-page`,
    });

    const response = await fetch(`${origin}/api/landing-page`);

    console.log({ response });

    if (!response.ok) {
      throw new Error(`Failed to fetch information: ${response.statusText}`);
    }

    const pageInformationData: PageInformation = await response.json();

    return pageInformationData;
  } catch (error) {
    console.error(error);
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
