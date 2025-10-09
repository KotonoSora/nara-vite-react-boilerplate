import { CircleChevronRight } from "lucide-react";
import { memo } from "react";
import { Link, useLoaderData } from "react-router";

import type { PageInformation, ProjectInfo } from "../types/type";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

import { ShowcaseItem } from "../components/showcase-item";

export const ShowcaseSection = memo(function ShowcaseSection() {
  const { t } = useI18n();
  const { showcases } = useLoaderData<PageInformation>();

  return (
    <section className="py-16 px-6 lg:px-24 bg-background content-visibility-auto">
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

      <div className="max-w-5xl mx-auto text-center space-y-4 mt-10">
        <Button asChild variant="ghost">
          <Link to="/showcases">
            <span>{t("landing.github.seeMore")}</span>
            <CircleChevronRight />
          </Link>
        </Button>
      </div>
    </section>
  );
});
