import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

import { Button } from "~/components/ui/button";

export default function ShowcaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="flex-1 overflow-auto">
      <Outlet />
    </main>
  );
}
