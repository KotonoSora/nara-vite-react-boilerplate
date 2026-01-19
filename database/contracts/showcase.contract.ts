/**
 * Contract boundary for showcase domain types.
 * Re-exports types derived from Drizzle schema without exposing infrastructure.
 *
 * Upper layers (services, controllers) should import from this file,
 * never directly from schema files.
 */
export type { Showcase, NewShowcase } from "../schema/showcase";
