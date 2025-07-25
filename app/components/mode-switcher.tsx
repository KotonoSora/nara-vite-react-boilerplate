import { Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import { Theme } from "remix-themes";

import { Button } from "~/components/ui/button";
import { useThemeMode } from "~/hooks/use-theme-mode";

export function ModeSwitcher() {
  const { theme, toggleTheme } = useThemeMode();

  const icon = useMemo(() => {
    if (theme === Theme.DARK) {
      return <Moon className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  }, [theme]);

  const label = useMemo(() => {
    if (theme === Theme.DARK) return "Dark theme";
    return "Light theme";
  }, [theme]);

  const nextThemeLabel = useMemo(() => {
    return theme === Theme.DARK ? "light" : "dark";
  }, [theme]);

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0"
      aria-label={`Current: ${label}. Click to switch to ${nextThemeLabel} theme`}
      onClick={toggleTheme}
      style={{ contentVisibility: "auto" }}
    >
      {icon}
    </Button>
  );
}
