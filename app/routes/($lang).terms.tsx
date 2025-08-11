import type { Route } from "./+types/($lang).terms";

import { PageContext } from "~/features/legal/terms/context/page-context";
import { ContentTermsPage } from "~/features/legal/terms/page";
import { getLegalPageLoaderData } from "~/lib/routes/legal-page-loader";
import { metaFromLoaderData } from "~/lib/routes/meta-helpers";

export async function loader({ request, context }: Route.LoaderArgs) {
  const {
    cloudflare: { env },
  } = context;
  return getLegalPageLoaderData(
    request,
    env,
    "legal.terms.title",
    "legal.terms.description",
  );
}

export function meta({ data }: Route.MetaArgs) {
  return metaFromLoaderData(data);
}
export default function TermsPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={loaderData}>
      <ContentTermsPage />
    </PageContext.Provider>
  );
}
