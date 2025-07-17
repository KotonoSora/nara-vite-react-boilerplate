import { FeatureGate, useFeatureFlag } from "~/features/feature-flags";

/**
 * Example component demonstrating feature flag usage
 * This shows both the hook approach and the component approach
 */
export function FeatureFlagDemo() {
  // Example using the hook
  const isBetaFeatureEnabled = useFeatureFlag("beta-dashboard");
  const isAdvancedAnalyticsEnabled = useFeatureFlag("advanced-analytics");

  return (
    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-semibold mb-4">🚩 Feature Flag Demo</h3>
      
      <div className="space-y-4">
        {/* Example using the hook */}
        <div>
          <h4 className="font-medium mb-2">Hook Example:</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Beta Dashboard: {isBetaFeatureEnabled ? "✅ Enabled" : "❌ Disabled"}
          </p>
          {isBetaFeatureEnabled && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
              🎉 Welcome to the new beta dashboard! This feature is only visible to users 
              in the beta testing group.
            </div>
          )}
        </div>

        {/* Example using the FeatureGate component */}
        <div>
          <h4 className="font-medium mb-2">Component Example:</h4>
          <FeatureGate 
            flag="advanced-analytics" 
            fallback={
              <div className="p-3 bg-gray-50 border-l-4 border-gray-400 text-gray-600">
                📊 Advanced Analytics: Available in premium tier
              </div>
            }
          >
            <div className="p-3 bg-green-50 border-l-4 border-green-400 text-green-800">
              📈 Advanced Analytics Dashboard - Charts, insights, and detailed metrics!
            </div>
          </FeatureGate>
        </div>

        {/* Example with multiple flags */}
        <div>
          <h4 className="font-medium mb-2">Multiple Flags Example:</h4>
          <FeatureGate 
            flags={["premium-tier", "advanced-analytics"]} 
            mode="all"
            fallback={
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                ⭐ Premium Analytics: Requires both premium tier and advanced analytics features
              </div>
            }
          >
            <div className="p-3 bg-purple-50 border-l-4 border-purple-400 text-purple-800">
              💎 Premium Analytics Suite - Exclusive features for premium users!
            </div>
          </FeatureGate>
        </div>

        {/* Rollout phase indicator */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Rollout Phases:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
              <div className="font-medium text-red-800">Internal</div>
              <div className="text-red-600">Team Testing</div>
            </div>
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-center">
              <div className="font-medium text-orange-800">Beta 1-3</div>
              <div className="text-orange-600">Limited Users</div>
            </div>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
              <div className="font-medium text-blue-800">Partners</div>
              <div className="text-blue-600">White-label</div>
            </div>
            <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
              <div className="font-medium text-green-800">Production</div>
              <div className="text-green-600">All Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}