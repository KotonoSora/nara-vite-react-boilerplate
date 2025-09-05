import { useMemo, useState } from "react";

import type { CalendarEngineMode, PageProviderProps } from "../types/type";

import { DEFAULT_MODE, DEFAULT_WEEKS_PER_SCREEN } from "../constants/common";
import { PageContext } from "./page-context";

export function PageProvider({ children }: PageProviderProps) {
  const [weeksPerScreen, setWeeksPerScreen] = useState<number>(
    DEFAULT_WEEKS_PER_SCREEN,
  );
  const [mode, setMode] = useState<CalendarEngineMode>(DEFAULT_MODE);

  const pageContextValue = useMemo(() => {
    return { weeksPerScreen, setWeeksPerScreen, mode, setMode };
  }, [weeksPerScreen, setWeeksPerScreen, mode, setMode]);

  return (
    <PageContext.Provider value={pageContextValue}>
      {children}
    </PageContext.Provider>
  );
}
