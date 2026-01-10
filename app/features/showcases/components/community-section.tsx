import { FolderOpen } from "lucide-react";
import { use, useState } from "react";
import { useLoaderData } from "react-router";

import type { PageInformation, ProjectInfo } from "../types/type";

import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import { ShowcaseDetailModal } from "./showcase-detail-modal";
import { ShowcaseItem } from "./showcase-item";

export function CommunitySection() {
  const t = useTranslation();
  const { showcases: fetchShowcases, builtInDemos } =
    useLoaderData<PageInformation>();
  const { items: showcases } = use(fetchShowcases);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(
    null,
  );
  const hasBuiltInDemos =
    Array.isArray(builtInDemos) && builtInDemos.length > 0;
  const hasShowcases = Array.isArray(showcases) && showcases.length > 0;
  const showSeparator = hasBuiltInDemos;

  return (
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
              <ShowcaseItem
                key={project.id}
                project={project}
                onItemClick={setSelectedProject}
              />
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

      <ShowcaseDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
