import { Outlet } from "react-router";

import { ButtonScrollToTop } from "~/features/shared/components/button-scroll-to-top";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

export function BlogPage() {
  return (
    <>
      <HeaderNavigation />
      <Outlet />
      <FooterSection />
      <ButtonScrollToTop />
    </>
  );
}
