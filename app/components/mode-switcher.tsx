import { MoonIcon, SunIcon } from "lucide-react";
import React from "react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "~/components/ui/button";

export function ModeSwitcher() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  }, [theme, setTheme]);

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0 cursor-pointer content-visibility-auto"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
    </Button>
  );
}
