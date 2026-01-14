/**
 * Contract boundary for showcase-tag relationship types.
 * Re-exports types derived from Drizzle schema without exposing infrastructure.
 *
 * Upper layers (services, controllers) should import from this file,
 * never directly from schema files.
 */
export type { ShowcaseTag, NewShowcaseTag } from "../schema/showcaseTag";
