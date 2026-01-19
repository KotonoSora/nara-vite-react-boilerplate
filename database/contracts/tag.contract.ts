/**
 * Contract boundary for tag domain types.
 * Re-exports types derived from Drizzle schema without exposing infrastructure.
 *
 * Upper layers (services, controllers) should import from this file,
 * never directly from schema files.
 */
export type { Tag, NewTag } from "../schema/tag";
