import { Moon, Sun, Monitor } from "lucide-react";
import React from "react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "~/components/ui/button";
import { useUserPreferences } from "~/hooks/use-user-preferences";

export function ModeSwitcher() {
  const [theme] = useTheme();
  const { preferences, updatePreferences } = useUserPreferences();

  const toggleTheme = React.useCallback(() => {
    const currentTheme = preferences.colorTheme;
    let nextTheme: 'light' | 'dark' | 'system';
    
    if (currentTheme === 'light') {
      nextTheme = 'dark';
    } else if (currentTheme === 'dark') {
      nextTheme = 'system';
    } else {
      nextTheme = 'light';
    }
    
    updatePreferences({ colorTheme: nextTheme });
  }, [preferences.colorTheme, updatePreferences]);

  const getIcon = () => {
    if (preferences.colorTheme === 'system') {
      return <Monitor className="h-4 w-4" />;
    } else if (theme === Theme.DARK) {
      return <Moon className="h-4 w-4" />;
    } else {
      return <Sun className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    if (preferences.colorTheme === 'system') {
      return 'System theme';
    } else if (theme === Theme.DARK) {
      return 'Dark theme';
    } else {
      return 'Light theme';
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
