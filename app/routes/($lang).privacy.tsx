import type { Route } from "./+types/($lang).privacy";

import { PageContext } from "~/features/legal/privacy/context/page-context";
import { ContentPrivacyPage } from "~/features/legal/privacy/page";
import { getLegalPageLoaderData } from "~/lib/routes/legal-page-loader";
import { metaFromLoaderData } from "~/lib/routes/meta-helpers";

export async function loader({ request, context }: Route.LoaderArgs) {
  const {
    cloudflare: { env },
  } = context;
  return getLegalPageLoaderData(
    request,
    env,
    "legal.privacy.title",
    "legal.privacy.description",
  );
}

export function meta({ data }: Route.MetaArgs) {
  return metaFromLoaderData(data);
}
export default function PrivacyPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentPrivacyPage />
    </PageContext.Provider>
  );
}
