import { FolderOpen } from "lucide-react";
import { useLoaderData } from "react-router";

import type { PageInformation } from "./types/type";

import { Separator } from "~/components/ui/separator";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { useI18n } from "~/lib/i18n/hooks/common";

import { ButtonScrollToTop } from "../shared/components/button-scroll-to-top";
import { BuiltInDemoItem } from "./components/built-in-demo-item";
import { ShowcaseItem } from "./components/showcase-item";

export function ContentShowcasePage() {
  const { t } = useI18n();
  const { showcases, builtInDemos } = useLoaderData<PageInformation>();

  const hasBuiltInDemos =
    Array.isArray(builtInDemos) && builtInDemos.length > 0;
  const hasShowcases = Array.isArray(showcases) && showcases.length > 0;
  const showSeparator = hasBuiltInDemos;

  return (
    <>
      <main className="min-h-screen bg-background content-visibility-auto">
        {/* Header/Navigation Section */}
        <HeaderNavigation />

        {/* Main Content Area */}
        <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-4">
          {/* Built-in Demos Section */}
          {hasBuiltInDemos && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-primary">
                    {t("landing.showcase.builtInDemos.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.showcase.builtInDemos.description")}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {builtInDemos.map((project) => (
                    <BuiltInDemoItem key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Separator */}
          {showSeparator && (
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <Separator className="my-8" />
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl font-bold">
                    {t("landing.showcase.communityShowcases.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.showcase.communityShowcases.description")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Community Showcases */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {!showSeparator && (
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl font-bold">
                    {t("landing.showcase.communityShowcases.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.showcase.communityShowcases.description")}
                  </p>
                </div>
              )}

              {hasShowcases ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {showcases.map((project) => (
                    <ShowcaseItem key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-4 sm:mb-6">
                      <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                      {t("showcase.emptyTitle")}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {t("showcase.emptyMessage")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <FooterSection />
      </main>

      {/* Scroll to Top Button */}
      <ButtonScrollToTop />
    </>
  );
}
