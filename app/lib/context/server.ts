import { createContext } from "react-router";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

export type CloudflareContextType = {
  env: Env;
};

export const CloudflareContext = createContext<CloudflareContextType>();

export const DatabaseContext = createContext<DrizzleD1Database<
  typeof schema
> | null>(null);
