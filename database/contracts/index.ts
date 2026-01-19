/**
 * Main contract index - exports all domain types from contract boundaries.
 * This is the primary entry point for consuming database types in upper layers.
 */
export type { Showcase, NewShowcase } from "./showcase.contract";
export type { Tag, NewTag } from "./tag.contract";
export type { ShowcaseTag, NewShowcaseTag } from "./showcaseTag.contract";
