import { ExternalLink, Menu, PanelRightClose } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import SocialPreview from "~/features/landing-page/assets/social-preview.svg?url";

export default function ShowcaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);

  const openDetail = (project: ProjectInfo) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  const closeDetail = () => {
    setSheetOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b px-4 py-2 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground">Home / Showcase</div>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Header Context (customize later)
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`transition-all duration-300 bg-muted/40 border-r overflow-auto ${
            sidebarOpen ? "w-64" : "w-14"
          }`}
        >
          <div className="p-4 text-xs text-muted-foreground">
            {sidebarOpen ? "Sidebar content here" : null}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet
            context={{
              openDetail,
              closeDetail,
            }}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t p-4 text-xs text-center text-muted-foreground bg-background">
        Footer Context (customize later)
      </footer>

      {/* Sheet for Project Details */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>{selectedProject?.name}</span>
              {selectedProject && (
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open project"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          
          {selectedProject && (
            <div className="mt-6 space-y-6">
              {/* Project Image */}
              <div className="w-full">
                <img
                  src={selectedProject.image ?? SocialPreview}
                  alt={selectedProject.name}
                  className="w-full h-48 object-cover rounded-lg border"
                  loading="lazy"
                />
              </div>
              
              {/* Project Description */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
              
              {/* Project URL */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Website
                </h3>
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {selectedProject.url}
                </a>
              </div>
              
              {/* Project Tags */}
              {selectedProject.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
