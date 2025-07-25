import { Theme, useTheme } from "remix-themes";

export const useThemeMode = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    const currentTheme = theme || Theme.LIGHT;
    const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
  };

  return { theme: theme || Theme.LIGHT, toggleTheme };
};
