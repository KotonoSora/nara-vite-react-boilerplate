import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

import { ManageShowcase } from "./components/manage-showcases";

export function ContentDashboardPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      {/* Header */}
      <HeaderNavigation />

      {/* Main Section */}
      <section className="container mx-auto px-4 py-8">
        <ManageShowcase />
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
