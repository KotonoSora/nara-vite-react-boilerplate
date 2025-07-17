import { createContext, useContext } from "react";

import type { FeatureFlagEvaluation } from "./types";

interface FeatureFlagContextValue {
  flags: FeatureFlagEvaluation;
  isLoading: boolean;
}

export const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  flags: {},
  isLoading: true,
});

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}

/**
 * Hook to check if a specific feature flag is enabled
 * @param flagName - The name of the feature flag to check
 * @returns boolean indicating if the flag is enabled
 */
export function useFeatureFlag(flagName: string): boolean {
  const { flags } = useFeatureFlags();
  return flags[flagName] ?? false;
}

/**
 * Hook to check if any of the provided feature flags are enabled
 * @param flagNames - Array of feature flag names to check
 * @returns boolean indicating if any of the flags are enabled
 */
export function useAnyFeatureFlag(flagNames: string[]): boolean {
  const { flags } = useFeatureFlags();
  return flagNames.some(flagName => flags[flagName] ?? false);
}

/**
 * Hook to check if all of the provided feature flags are enabled
 * @param flagNames - Array of feature flag names to check
 * @returns boolean indicating if all flags are enabled
 */
export function useAllFeatureFlags(flagNames: string[]): boolean {
  const { flags } = useFeatureFlags();
  return flagNames.every(flagName => flags[flagName] ?? false);
}