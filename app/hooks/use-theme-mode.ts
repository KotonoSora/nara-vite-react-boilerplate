import { useCallback, useEffect, useState } from "react";
import { Theme, useTheme } from "remix-themes";

type ThemeMode = "light" | "dark" | "system";

export const useThemeMode = () => {
  const [theme, setTheme] = useTheme();
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (theme === Theme.DARK) return "dark";
    if (theme === Theme.LIGHT) return "light";
    return "system";
  });

  const getSystemTheme = useCallback((): Theme => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? Theme.DARK : Theme.LIGHT;
  }, []);

  const applyTheme = useCallback(
    (currentMode: ThemeMode) => {
      if (currentMode === "light") {
        setTheme(Theme.LIGHT);
        return;
      }

      if (currentMode === "dark") {
        setTheme(Theme.DARK);
        return;
      }

      if (currentMode === "system") {
        setTheme(getSystemTheme());
        return;
      }
    },
    [setTheme, getSystemTheme],
  );

  useEffect(() => {
    applyTheme(mode);

    if (mode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mode, applyTheme]);

  const getNextMode = useCallback((currentMode: ThemeMode): ThemeMode => {
    if (currentMode === "light") return "dark";
    if (currentMode === "dark") return "system";
    return "light";
  }, []);

  const toggleMode = useCallback(() => {
    setMode((currentMode) => getNextMode(currentMode));
  }, [getNextMode]);

  return { mode, theme, toggleMode };
};
