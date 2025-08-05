import { Theme, useTheme } from "remix-themes";
import { useCallback } from "react";

export const useThemeMode = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = useCallback(() => {
    const currentTheme = theme || Theme.LIGHT;
    const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
  }, [theme, setTheme]);

  return { 
    theme: theme || Theme.LIGHT, 
    toggleTheme,
    isDark: theme === Theme.DARK,
    isLight: theme === Theme.LIGHT || !theme
  };
};
