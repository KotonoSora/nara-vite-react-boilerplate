import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigationSection } from "~/features/shared/components/header-navigation-section";
import { useI18n } from "~/lib/i18n/context";

import { ButtonScrollToTop } from "../shared/components/button-scroll-to-top";
import { ShowcaseItem } from "./components/showcase-item";
import { usePageContext } from "./context/page-context";

export function ContentShowcasePage() {
  const { t } = useI18n();
  const { showcases } = usePageContext() || {};

  return (
    <>
      <main
        className="min-h-screen bg-background flex flex-col"
        style={{ contentVisibility: "auto" }}
      >
        {/* Header/Navigation Section */}
        <HeaderNavigationSection usePageContext={usePageContext} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4">
            {Array.isArray(showcases) &&
              showcases.map((project) => (
                <ShowcaseItem key={project.id} project={project} />
              ))}

            {!Array.isArray(showcases) || showcases.length === 0 ? (
              <div className="col-span-full flex items-center justify-center min-h-[50vh]">
                <div className="border border-dashed border-muted-foreground rounded-md p-6 max-w-md w-full mx-4">
                  <p className="text-center text-muted-foreground">
                    {t("showcase.emptyMessage")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Section */}
        <FooterSection />
      </main>

      {/* Scroll to Top Button */}
      <ButtonScrollToTop />
    </>
  );
}
