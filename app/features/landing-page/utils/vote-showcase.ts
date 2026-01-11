import { and, eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

const { showcase, showcaseVote } = schema;

export type VoteShowcaseData = {
  showcaseId: string;
  userId: string;
  value: -1 | 1;
};

export type VoteResult = {
  showcaseId: string;
  userId: string;
  userVote?: -1 | 1;
  upvotes: number;
  downvotes: number;
  score: number;
};

/**
 * Applies a user's vote to a showcase with counter updates.
 *
 * Logic:
 * - No existing vote: insert new vote, increment corresponding counter.
 * - Same vote repeated: remove vote (toggle off), decrement counter.
 * - Opposite vote: update vote, swap counters (e.g., +1 -> -1).
 *
 * Returns the updated counters and current `userVote` for UI sync.
 */
export async function voteShowcase(
  db: DrizzleD1Database<typeof schema>,
  data: VoteShowcaseData,
): Promise<VoteResult | undefined> {
  const { showcaseId, userId, value } = data;

  const item = await db
    .select({
      id: showcase.id,
      upvotes: showcase.upvotes,
      downvotes: showcase.downvotes,
      score: showcase.score,
    })
    .from(showcase)
    .where(eq(showcase.id, showcaseId))
    .get();

  if (!item) return undefined;

  const existing = await db
    .select({ value: showcaseVote.value })
    .from(showcaseVote)
    .where(
      and(
        eq(showcaseVote.showcaseId, showcaseId),
        eq(showcaseVote.userId, userId),
      ),
    )
    .get();

  let upvotes = item.upvotes ?? 0;
  let downvotes = item.downvotes ?? 0;
  let score = item.score ?? 0;
  let userVote: -1 | 1 | undefined = undefined;

  if (!existing) {
    await db.insert(showcaseVote).values({ showcaseId, userId, value });
    if (value === 1) {
      upvotes += 1;
      score += 1;
    } else {
      downvotes += 1;
      score -= 1;
    }
    userVote = value;
  } else if (existing.value === value) {
    // Toggle off the same vote
    await db
      .delete(showcaseVote)
      .where(
        and(
          eq(showcaseVote.showcaseId, showcaseId),
          eq(showcaseVote.userId, userId),
        ),
      );
    if (value === 1) {
      upvotes = Math.max(0, upvotes - 1);
      score -= 1;
    } else {
      downvotes = Math.max(0, downvotes - 1);
      score += 1;
    }
    userVote = undefined;
  } else {
    // Switch vote from +1 to -1 or vice versa
    await db
      .update(showcaseVote)
      .set({ value })
      .where(
        and(
          eq(showcaseVote.showcaseId, showcaseId),
          eq(showcaseVote.userId, userId),
        ),
      );

    if (existing.value === 1 && value === -1) {
      upvotes = Math.max(0, upvotes - 1);
      downvotes += 1;
      score -= 2;
    } else if (existing.value === -1 && value === 1) {
      downvotes = Math.max(0, downvotes - 1);
      upvotes += 1;
      score += 2;
    }
    userVote = value;
  }

  await db
    .update(showcase)
    .set({ upvotes, downvotes, score, updatedAt: new Date() })
    .where(eq(showcase.id, showcaseId));

  return { showcaseId, userId, userVote, upvotes, downvotes, score };
}
