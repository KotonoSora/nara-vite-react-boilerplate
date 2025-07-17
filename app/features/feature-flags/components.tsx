import type { ReactNode } from "react";

import { useFeatureFlag, useAllFeatureFlags, useAnyFeatureFlag } from "./context";

interface FeatureGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SingleFeatureGateProps extends FeatureGateProps {
  flag: string;
}

interface MultipleFeatureGateProps extends FeatureGateProps {
  flags: string[];
  mode?: "any" | "all";
}

type FeatureGatePropsUnion = SingleFeatureGateProps | MultipleFeatureGateProps;

/**
 * Component that conditionally renders children based on feature flag status
 * 
 * @example
 * // Single feature flag
 * <FeatureGate flag="new-dashboard">
 *   <NewDashboard />
 * </FeatureGate>
 * 
 * @example  
 * // Multiple feature flags (any enabled)
 * <FeatureGate flags={["beta-feature-1", "beta-feature-2"]} mode="any">
 *   <BetaFeatures />
 * </FeatureGate>
 * 
 * @example
 * // Multiple feature flags (all enabled) with fallback
 * <FeatureGate 
 *   flags={["advanced-analytics", "premium-tier"]} 
 *   mode="all"
 *   fallback={<BasicAnalytics />}
 * >
 *   <AdvancedAnalytics />
 * </FeatureGate>
 */
export function FeatureGate(props: FeatureGatePropsUnion) {
  const { children, fallback = null } = props;
  
  let isEnabled: boolean;

  if ("flag" in props) {
    // Single flag mode
    isEnabled = useFeatureFlag(props.flag);
  } else {
    // Multiple flags mode
    const { flags, mode = "any" } = props;
    isEnabled = mode === "all" 
      ? useAllFeatureFlags(flags)
      : useAnyFeatureFlag(flags);
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component that wraps a component with feature flag protection
 * 
 * @example
 * const ProtectedComponent = withFeatureFlag("new-feature")(MyComponent);
 * 
 * @example
 * const ProtectedComponent = withFeatureFlag(
 *   ["feature-1", "feature-2"], 
 *   "all",
 *   <LoadingFallback />
 * )(MyComponent);
 */
export function withFeatureFlag(
  flagOrFlags: string | string[],
  mode: "any" | "all" = "any",
  fallback?: ReactNode
) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function WrappedComponent(props: P) {
      if (typeof flagOrFlags === "string") {
        return (
          <FeatureGate flag={flagOrFlags} fallback={fallback}>
            <Component {...props} />
          </FeatureGate>
        );
      } else {
        return (
          <FeatureGate flags={flagOrFlags} mode={mode} fallback={fallback}>
            <Component {...props} />
          </FeatureGate>
        );
      }
    };
  };
}