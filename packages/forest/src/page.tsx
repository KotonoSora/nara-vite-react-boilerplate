import { PageContent } from "./components/page-content";
import { ForestProvider } from "./context/forest-context";

export function ForestPage({
  isProd,
  trackingId,
}: {
  isProd: boolean;
  trackingId: string | undefined;
}) {
  return (
    <ForestProvider isProd={isProd} trackingId={trackingId}>
      <PageContent />
    </ForestProvider>
  );
}
