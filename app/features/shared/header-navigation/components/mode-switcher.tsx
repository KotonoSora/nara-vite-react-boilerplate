import { trackCustomEvents } from "@kotonosora/google-analytics";
import { Button } from "@kotonosora/ui/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

export function getNextTheme(theme: Theme | null) {
  return theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
}

export function ModeSwitcher() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((preTheme) => getNextTheme(preTheme));

    // tracking switch theme event
    trackCustomEvents({
      isProd: import.meta.env.PROD,
      trackingId: import.meta.env.VITE_GOOGLE_ANALYTIC_TRACKING_ID,
      event: {
        event_category: "Switch",
        event_label: `Switch to the new theme ${getNextTheme(theme)}`,
      },
    });
  };

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
