import { CircleChevronRight } from "lucide-react";
import { Link, useLoaderData } from "react-router";

import type { ProjectInfo } from "~/features/showcases/types/type";

import type { PageInformation } from "../types/type";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useI18n } from "~/lib/i18n/hooks/common";

import { BuiltInDemoItem } from "../components/built-in-demo-item";
import { ShowcaseItem } from "../components/showcase-item";

export function ShowcaseSection() {
  const { t } = useI18n();
  const { showcases, builtInDemos } = useLoaderData<PageInformation>();

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

      {/* Built-in Demos Section */}
      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-primary">
            {t("landing.showcase.builtInDemos.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("landing.showcase.builtInDemos.description")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {builtInDemos.map((project: ProjectInfo) => (
            <BuiltInDemoItem key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Separator */}
      {Array.isArray(showcases) && showcases.length > 0 && (
        <div className="max-w-5xl mx-auto my-12">
          <Separator className="my-8" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">
              {t("landing.showcase.communityShowcases.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("landing.showcase.communityShowcases.description")}
            </p>
          </div>
        </div>
      )}

      {/* Database Showcases */}
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
}
