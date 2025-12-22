import { Suspense } from "react";
import { useLoaderData } from "react-router";

import type { PageInformation } from "./types/type";

import { Separator } from "~/components/ui/separator";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import { ButtonScrollToTop } from "../shared/components/button-scroll-to-top";
import { BuiltInDemoItem } from "./components/built-in-demo-item";
import { CommunitySection } from "./components/community-section";

export function ContentShowcasePage() {
  const t = useTranslation();
  const { showcases, builtInDemos } = useLoaderData<PageInformation>();

  const hasBuiltInDemos =
    Array.isArray(builtInDemos) && builtInDemos.length > 0;
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
          <Suspense fallback={<div>Loading...</div>}>
            <CommunitySection />
          </Suspense>
        </section>

        {/* Footer Section */}
        <FooterSection />
      </main>

      {/* Scroll to Top Button */}
      <ButtonScrollToTop />
    </>
  );
}
