import type { DrizzleD1Database } from "drizzle-orm/d1";
import { and, eq, inArray, or } from "drizzle-orm";

import type { FeatureFlagEvaluationContext, FeatureFlagEvaluation } from "./types";
import * as schema from "~/database/schema";

/**
 * Evaluates all feature flags for a given context (user/groups)
 * Returns a map of flag names to boolean enabled status
 */
export async function evaluateFeatureFlags(
  db: DrizzleD1Database<typeof schema>,
  context: FeatureFlagEvaluationContext = {}
): Promise<FeatureFlagEvaluation> {
  const { userId, userGroups = [], isAdmin = false } = context;

  // Get all enabled feature flags
  const flags = await db.select().from(schema.featureFlags).where(
    eq(schema.featureFlags.enabled, true)
  );

  const evaluation: FeatureFlagEvaluation = {};

  for (const flag of flags) {
    // Admin users get access to all enabled flags
    if (isAdmin) {
      evaluation[flag.name] = true;
      continue;
    }

    // Check for specific assignments for this flag
    const assignments = await getFeatureFlagAssignments(db, flag.id, {
      userId,
      userGroups,
    });

    // If there are specific assignments, use them
    if (assignments.length > 0) {
      evaluation[flag.name] = assignments.some(assignment => assignment.enabled);
      continue;
    }

    // Fall back to rollout percentage
    evaluation[flag.name] = isInRolloutPercentage(flag.rolloutPercentage, userId);
  }

  return evaluation;
}

/**
 * Checks if a specific feature flag is enabled for the given context
 */
export async function isFeatureFlagEnabled(
  db: DrizzleD1Database<typeof schema>,
  flagName: string,
  context: FeatureFlagEvaluationContext = {}
): Promise<boolean> {
  const evaluation = await evaluateFeatureFlags(db, context);
  return evaluation[flagName] ?? false;
}

/**
 * Gets feature flag assignments for a specific flag and context
 */
async function getFeatureFlagAssignments(
  db: DrizzleD1Database<typeof schema>,
  flagId: number,
  context: { userId?: string; userGroups?: string[] }
) {
  const { userId, userGroups = [] } = context;

  const conditions = [];

  // Check for user-specific assignments
  if (userId) {
    conditions.push(eq(schema.featureFlagAssignments.userId, userId));
  }

  // Check for group assignments
  if (userGroups.length > 0) {
    const groupIds = await db
      .select({ id: schema.userGroups.id })
      .from(schema.userGroups)
      .where(inArray(schema.userGroups.name, userGroups));

    if (groupIds.length > 0) {
      conditions.push(
        inArray(
          schema.featureFlagAssignments.userGroupId,
          groupIds.map(g => g.id)
        )
      );
    }
  }

  if (conditions.length === 0) {
    return [];
  }

  return await db
    .select()
    .from(schema.featureFlagAssignments)
    .where(
      and(
        eq(schema.featureFlagAssignments.featureFlagId, flagId),
        or(...conditions)
      )
    );
}

/**
 * Determines if a user falls within the rollout percentage using consistent hashing
 */
function isInRolloutPercentage(percentage: number, userId?: string): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;
  if (!userId) return false;

  // Simple hash function for consistent rollout
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const bucket = Math.abs(hash) % 100;
  return bucket < percentage;
}

/**
 * Seeds the database with default user groups for rollout phases
 */
export async function seedDefaultUserGroups(
  db: DrizzleD1Database<typeof schema>
) {
  const defaultGroups = [
    {
      name: "internal",
      description: "Internal team members (CEO, Marketing, Sales, Partnerships)",
    },
    {
      name: "beta_1",
      description: "Beta 1 testing group - limited early access",
    },
    {
      name: "beta_2", 
      description: "Beta 2 testing group - expanded testing",
    },
    {
      name: "beta_3",
      description: "Beta 3 testing group - pre-production validation",
    },
    {
      name: "white_label_partners",
      description: "White-label partners and integration partners",
    },
    {
      name: "large_data_customers",
      description: "High-volume data customers and enterprise users",
    },
    {
      name: "high_tier_users",
      description: "Premium subscribers and high-value users",
    },
    {
      name: "production",
      description: "All production users - full public release",
    },
  ];

  for (const group of defaultGroups) {
    try {
      await db.insert(schema.userGroups).values(group).onConflictDoNothing();
    } catch (error) {
      // Group might already exist, continue
      console.warn(`User group ${group.name} might already exist:`, error);
    }
  }
}