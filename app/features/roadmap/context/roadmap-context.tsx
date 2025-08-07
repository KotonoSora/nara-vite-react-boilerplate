import { createContext, useContext, type FC, type ReactNode } from "react";

import type { RoadmapData, RequestGuide } from "../types/roadmap-types";

interface RoadmapContextValue {
  roadmapData: RoadmapData;
  requestGuide: RequestGuide;
}

const RoadmapContext = createContext<RoadmapContextValue | undefined>(undefined);

interface RoadmapProviderProps {
  children: ReactNode;
  roadmapData: RoadmapData;
  requestGuide: RequestGuide;
}

export const RoadmapProvider: FC<RoadmapProviderProps> = ({
  children,
  roadmapData,
  requestGuide,
}) => {
  return (
    <RoadmapContext.Provider value={{ roadmapData, requestGuide }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = (): RoadmapContextValue => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
};