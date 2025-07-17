export interface FeatureFlag {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserGroup {
  id: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface FeatureFlagAssignment {
  id: number;
  featureFlagId: number;
  userGroupId?: number;
  userId?: string;
  enabled: boolean;
  createdAt: number;
}

export interface FeatureFlagEvaluationContext {
  userId?: string;
  userGroups?: string[];
  isAdmin?: boolean;
}

export interface FeatureFlagEvaluation {
  [flagName: string]: boolean;
}

// Predefined user groups for rollout phases
export const USER_GROUPS = {
  INTERNAL: "internal",
  BETA_1: "beta_1", 
  BETA_2: "beta_2",
  BETA_3: "beta_3",
  PRODUCTION: "production",
  WHITE_LABEL_PARTNERS: "white_label_partners",
  LARGE_DATA_CUSTOMERS: "large_data_customers",
  HIGH_TIER_USERS: "high_tier_users",
} as const;

export type UserGroupName = typeof USER_GROUPS[keyof typeof USER_GROUPS];