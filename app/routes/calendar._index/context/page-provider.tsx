import { useState } from "react";

import type { ReactNode } from "react";
import type { CalendarEngineMode } from "../types/type";

import { PageContext } from "./page-context";

export function PageProvider({ children }: { children: ReactNode }) {
  const [weeksPerScreen, setWeeksPerScreen] = useState<number>(2);
  const [mode, setMode] = useState<CalendarEngineMode>("sequence");

  return (
    <PageContext.Provider
      value={{ weeksPerScreen, setWeeksPerScreen, mode, setMode }}
    >
      {children}
    </PageContext.Provider>
  );
}
