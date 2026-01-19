import type { NewShowcase } from "~/database/contracts";

/**
 * Model representing a single showcase item for seeding.
 */
export type SeedShowcaseItem = Omit<NewShowcase, "id"> & { tags: string[] };
/**
 * Model representing the seed showcase response.
 */
export type SeedShowcaseResponse = {
  message: string;
  count: number;
};
