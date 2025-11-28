import { PageContent } from "./components/page-content";
import { ForestProvider } from "./context/forest-context";

export function ForestPage() {
  return (
    <ForestProvider>
      <PageContent />
    </ForestProvider>
  );
}
