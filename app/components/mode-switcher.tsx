import { Monitor, Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import { Theme } from "remix-themes";

import { Button } from "~/components/ui/button";
import { useThemeMode } from "~/hooks/use-theme-mode";

export function ModeSwitcher() {
  const { mode, theme, toggleMode } = useThemeMode();

  const icon = useMemo(() => {
    if (mode === "system") {
      return <Monitor className="h-4 w-4" />;
    }

    if (theme === Theme.DARK) {
      return <Moon className="h-4 w-4" />;
    }

    return <Sun className="h-4 w-4" />;
  }, [mode, theme]);

  const label = useMemo(() => {
    if (mode === "system") return "System theme";
    if (theme === Theme.DARK) return "Dark theme";
    return "Light theme";
  }, [mode, theme]);

  const nextModeLabel = useMemo(() => {
    if (mode === "light") return "dark";
    if (mode === "dark") return "system";
    return "light";
  }, [mode]);

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0"
      aria-label={`Current: ${label}. Click to switch to ${nextModeLabel} theme`}
      onClick={toggleMode}
      style={{ contentVisibility: "auto" }}
    >
      {icon}
    </Button>
  );
}
