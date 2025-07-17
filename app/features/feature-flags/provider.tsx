import { type ReactNode } from "react";

import { FeatureFlagContext } from "./context";
import type { FeatureFlagEvaluation } from "./types";

interface FeatureFlagProviderProps {
  children: ReactNode;
  flags: FeatureFlagEvaluation;
  isLoading?: boolean;
}

/**
 * Provider component that wraps the app with feature flag context
 * This should be used at the root level to provide feature flags to all components
 */
export function FeatureFlagProvider({
  children,
  flags,
  isLoading = false,
}: FeatureFlagProviderProps) {
  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}