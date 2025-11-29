import { createContext, useContext, useMemo } from "react";

import type { ReactNode } from "react";

import { useForestPage } from "../hooks/use-forest-page";

interface ForestContextValue {
  state: ReturnType<typeof useForestPage>["state"];
  timerLabel: string;
  progress: number;
  abandonTree: () => void;
  startGrowing: () => void;
  updateTimerPreview: (value: number) => void;
  resetToPlanting: () => void;
  tagColor: string;
  setTagColor: (color: string) => void;
  tagLabel: string;
  onLabelChange: (label: string) => void;
}

const ForestContext = createContext<ForestContextValue | undefined>(undefined);

export function ForestProvider({ children }: { children: ReactNode }) {
  const ctx = useForestPage();
  const value = useMemo(
    () => ({
      state: ctx.state,
      timerLabel: ctx.timerLabel,
      progress: ctx.progress,
      abandonTree: ctx.abandonTree,
      startGrowing: ctx.startGrowing,
      updateTimerPreview: ctx.updateTimerPreview,
      resetToPlanting: ctx.resetToPlanting,
      tagColor: ctx.tagColor,
      setTagColor: ctx.setTagColor,
      tagLabel: ctx.tagLabel,
      onLabelChange: ctx.onLabelChange,
    }),
    [ctx],
  );
  return (
    <ForestContext.Provider value={value}>{children}</ForestContext.Provider>
  );
}

export function useForestContext() {
  const ctx = useContext(ForestContext);
  if (!ctx)
    throw new Error("useForestContext must be used within ForestProvider");
  return ctx;
}
