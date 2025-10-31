import { Outlet } from "react-router";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

export function BlogPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto flex flex-col">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8 flex flex-col flex-1 justify-center items-center text-center">
        <Outlet />
      </section>

      <FooterSection />
    </main>
  );
}
