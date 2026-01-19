import type { NewShowcase, Showcase } from "~/database/contracts";

import type { CreateShowcaseInput } from "./create-showcase.validator";

/**
 * Input type for creating a showcase record (shared between service and repository).
 */
export type CreateShowcaseRecordInput = Omit<
  NewShowcase,
  "upvotes" | "downvotes" | "score" | "createdAt" | "updatedAt" | "deletedAt"
>;

/**
 * Maps API input to a new showcase database record.
 * Handles ID generation and field transformations.
 *
 * @param input - Validated API input
 * @returns Database record ready for insertion
 */
export function mapToShowcaseRecord(
  input: CreateShowcaseInput,
): Omit<
  NewShowcase,
  "upvotes" | "downvotes" | "score" | "createdAt" | "updatedAt" | "deletedAt"
> {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    publishedAt: input.publishedAt,
    authorId: input.authorId,
  };
}

/**
 * Model representing the created showcase response, extending Showcase with tags.
 */
export type CreatedShowcase = Showcase & { tags: string[] };
