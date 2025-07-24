import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Theme, useTheme } from "remix-themes";

type ThemeMode = "light" | "dark" | "system";

export const useThemeMode = () => {
  const [theme, setTheme] = useTheme();
  // Initialize to "system" to ensure consistent SSR/client rendering
  const [mode, setMode] = useState<ThemeMode>("system");

  // Update mode based on theme after hydration
  useEffect(() => {
    if (theme === Theme.DARK) {
      setMode("dark");
    } else if (theme === Theme.LIGHT) {
      setMode("light");
    } else {
      setMode("system");
    }
  }, [theme]);

  const getSystemTheme = useCallback((): Theme => {
    if (typeof window === "undefined") {
      return Theme.LIGHT;
    }
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
        if (typeof window === "undefined") {
          setTheme(Theme.LIGHT);
          return;
        }
        setTheme(getSystemTheme());
        return;
      }
    },
    [setTheme, getSystemTheme],
  );

  useLayoutEffect(() => {
    applyTheme(mode);
  }, [mode, applyTheme]);

  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") {
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
