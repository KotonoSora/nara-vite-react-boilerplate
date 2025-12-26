import { Outlet } from "react-router";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

export function BlogPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto flex flex-col">
      <HeaderNavigation />
      <Outlet />
      <FooterSection />
    </main>
  );
}
