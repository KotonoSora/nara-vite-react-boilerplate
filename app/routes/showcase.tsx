import { Menu, PanelRightClose } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

export default function ShowcaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState<React.ReactNode>(null);

  const openDetail = (content: React.ReactNode) => {
    setSheetContent(content);
    setSheetOpen(true);
  };

  const closeDetail = () => {
    setSheetOpen(false);
    setSheetContent(null);
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Project Details</SheetTitle>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            {sheetContent}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
