import { memo } from "react";

import { ShowcaseItem } from "~/features/landing-page/components/showcase-item";
import { usePageContext } from "~/features/landing-page/context/page-context";

export const ShowcaseSection = memo(function ShowcaseSection() {
  const { showcases } = usePageContext();

  if (!showcases || showcases.length < 1) return null;

  return (
    <section
      className="py-16 px-6 lg:px-24 bg-background"
      style={{ contentVisibility: "auto" }}
    >
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">🌟 Showcase</h2>
        <p className="text-muted-foreground text-sm">
          Projects proudly built with{" "}
          <code className="text-foreground">NARA</code>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
        {showcases.map((project: ProjectInfo) => (
          <ShowcaseItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
});
