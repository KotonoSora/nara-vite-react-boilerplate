import { Monitor, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "~/components/ui/button";

type ThemeMode = "light" | "dark" | "system";

export function ModeSwitcher() {
  const [theme, setTheme] = useTheme();
  const [colorTheme, setColorTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const applyTheme = () => {
      if (colorTheme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setTheme(prefersDark ? Theme.DARK : Theme.LIGHT);
      } else if (colorTheme === "light") {
        setTheme(Theme.LIGHT);
      } else if (colorTheme === "dark") {
        setTheme(Theme.DARK);
      }
    };

    applyTheme();

    if (colorTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [colorTheme, setTheme]);

  const toggleTheme = useCallback(() => {
    let nextTheme: ThemeMode;

    if (colorTheme === "light") {
      nextTheme = "dark";
    } else if (colorTheme === "dark") {
      nextTheme = "system";
    } else {
      nextTheme = "light";
    }

    setColorTheme(nextTheme);
  }, [colorTheme, setColorTheme]);

  const getIcon = () => {
    if (colorTheme === "system") {
      return <Monitor className="h-4 w-4" />;
    } else if (theme === Theme.DARK) {
      return <Moon className="h-4 w-4" />;
    } else {
      return <Sun className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    if (colorTheme === "system") {
      return "System theme";
    } else if (theme === Theme.DARK) {
      return "Dark theme";
    } else {
      return "Light theme";
    }
  };

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0 cursor-pointer"
      aria-label={getLabel()}
      onClick={toggleTheme}
      style={{ contentVisibility: "auto" }}
    >
      {getIcon()}
    </Button>
  );
}
