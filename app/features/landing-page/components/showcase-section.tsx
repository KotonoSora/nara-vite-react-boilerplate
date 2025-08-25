import { memo } from "react";

import { ShowcaseItem } from "~/features/landing-page/components/showcase-item";
import { usePageContext } from "~/features/landing-page/context/page-context";
import { useI18n } from "~/lib/i18n";

export const ShowcaseSection = memo(function ShowcaseSection() {
  const { t } = useI18n();
  const { showcases } = usePageContext();

  return (
    <section
      className="py-16 px-6 lg:px-24 bg-background"
      style={{ contentVisibility: "auto" }}
    >
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("landing.showcase.title")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("landing.showcase.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
        {Array.isArray(showcases) &&
          showcases.map((project: ProjectInfo) => (
            <ShowcaseItem key={project.id} project={project} />
          ))}
      </div>
    </section>
  );
});
