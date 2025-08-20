import type { User } from "~/user.server";

/**
 * Props for the admin content context.
 */
export interface AdminContentProps {
  user?: User;
}

export interface AdminLoaderData {
  readonly user: User;
  readonly pageTitle: string;
  readonly pageDescription: string;
}
