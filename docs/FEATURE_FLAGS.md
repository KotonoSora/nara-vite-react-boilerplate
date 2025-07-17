# Feature Flag System

This boilerplate includes a comprehensive feature flag system that supports gradual rollout phases for controlled feature releases.

## Overview

The feature flag system enables:
- **Internal Testing**: Share features with team members (CEO, Marketing, Sales, Partnerships)
- **Beta Programs**: Roll out to specific user groups (Beta 1, Beta 2, Beta 3)
- **Targeted Releases**: Deploy to white-label partners, large data customers, high-tier users
- **Production Rollout**: Full public release to all users
- **Percentage Rollout**: Gradual percentage-based rollouts with consistent hashing

## Quick Start

### 1. Using Feature Flags in Components

```tsx
import { useFeatureFlag, FeatureGate } from "~/features/feature-flags";

function MyComponent() {
  // Hook approach
  const isNewDashboard = useFeatureFlag("new-dashboard");
  
  return (
    <div>
      {/* Conditional rendering with hook */}
      {isNewDashboard && <NewDashboard />}
      
      {/* Component approach with fallback */}
      <FeatureGate flag="premium-feature" fallback={<BasicFeature />}>
        <PremiumFeature />
      </FeatureGate>
      
      {/* Multiple flags (all must be enabled) */}
      <FeatureGate flags={["premium-tier", "advanced-analytics"]} mode="all">
        <PremiumAnalytics />
      </FeatureGate>
      
      {/* Multiple flags (any can be enabled) */}
      <FeatureGate flags={["beta-1", "beta-2"]} mode="any">
        <BetaFeature />
      </FeatureGate>
    </div>
  );
}
```

### 2. Managing Feature Flags via API

```bash
# Get feature flags for current user
GET /api/feature-flags?userId=user123&userGroups=internal,beta_1

# Create a new feature flag (admin only)
POST /api/feature-flags?isAdmin=true
{
  "name": "new-dashboard",
  "description": "New dashboard interface",
  "enabled": true,
  "rolloutPercentage": 25
}

# Update a feature flag
PUT /api/feature-flags/1?isAdmin=true
{
  "enabled": true,
  "rolloutPercentage": 50
}

# Get all feature flags (admin only)
GET /api/feature-flags/all?isAdmin=true

# Seed default user groups
POST /api/feature-flags/seed?isAdmin=true
```

## Rollout Phases

The system supports structured rollout phases:

### 1. Internal Testing (internal)
- Team members: CEO, Marketing, Sales, Partnerships
- Early feedback and validation
- Internal stakeholder approval

### 2. Beta Programs (beta_1, beta_2, beta_3)
- **Beta 1**: Limited early access users
- **Beta 2**: Expanded testing group
- **Beta 3**: Pre-production validation
- Iterative refinement based on feedback

### 3. Targeted Groups
- **white_label_partners**: Integration partners
- **large_data_customers**: High-volume enterprise users
- **high_tier_users**: Premium subscribers

### 4. Production (production)
- Full public release
- All users have access

## User Groups

Default user groups are automatically created:

```typescript
const USER_GROUPS = {
  INTERNAL: "internal",
  BETA_1: "beta_1", 
  BETA_2: "beta_2",
  BETA_3: "beta_3",
  PRODUCTION: "production",
  WHITE_LABEL_PARTNERS: "white_label_partners",
  LARGE_DATA_CUSTOMERS: "large_data_customers",
  HIGH_TIER_USERS: "high_tier_users",
};
```

## Database Schema

### Feature Flags Table
```sql
CREATE TABLE feature_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage REAL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### User Groups Table
```sql
CREATE TABLE user_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### Feature Flag Assignments Table
```sql
CREATE TABLE feature_flag_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feature_flag_id INTEGER NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_group_id INTEGER REFERENCES user_groups(id) ON DELETE CASCADE,
  user_id TEXT, -- For individual user assignments
  enabled BOOLEAN DEFAULT true,
  created_at INTEGER NOT NULL
);
```

## Advanced Usage

### Higher-Order Component

```tsx
import { withFeatureFlag } from "~/features/feature-flags";

const ProtectedComponent = withFeatureFlag("premium-feature")(MyComponent);

// With fallback
const ProtectedComponent = withFeatureFlag(
  "premium-feature",
  "any",
  <LoadingFallback />
)(MyComponent);
```

### Server-Side Evaluation

```typescript
import { evaluateFeatureFlags } from "~/features/feature-flags/utils";

// In a loader or action
export async function loader({ context }: LoaderArgs) {
  const flags = await evaluateFeatureFlags(context.db, {
    userId: "user123",
    userGroups: ["internal", "beta_1"],
    isAdmin: false,
  });
  
  return { flags };
}
```

### Percentage Rollout

Features can be gradually rolled out using percentage-based distribution:

```typescript
// 25% rollout - consistent hash ensures same users get the feature
{
  "name": "new-feature",
  "enabled": true,
  "rolloutPercentage": 25
}
```

The system uses consistent hashing based on user ID to ensure the same users consistently see (or don't see) features during percentage rollouts.

## Best Practices

1. **Start Small**: Begin with internal testing before broader rollouts
2. **Use Descriptive Names**: Feature flag names should be clear and descriptive
3. **Plan Rollout Phases**: Define clear criteria for moving between phases
4. **Monitor Impact**: Track feature usage and user feedback
5. **Clean Up**: Remove feature flags after full rollout
6. **Document Changes**: Keep clear documentation of feature flag purposes

## Integration with Authentication

In a real application, you would integrate this with your authentication system:

```typescript
// In your root loader
export async function loader({ request, context }: LoaderArgs) {
  const user = await authenticateUser(request);
  
  const flags = await evaluateFeatureFlags(context.db, {
    userId: user.id,
    userGroups: user.groups,
    isAdmin: user.isAdmin,
  });
  
  return { user, flags };
}
```

This feature flag system provides a robust foundation for controlled feature releases while maintaining type safety and following React best practices.