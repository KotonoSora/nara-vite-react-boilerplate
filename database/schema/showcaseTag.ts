import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { showcase } from "./showcase";
import { tag } from "./tag";

export const showcaseTag = sqliteTable(
  "showcase_tags",
  {
    showcaseId: text("showcase_id")
      .notNull()
      .references(() => showcase.id, { onDelete: "cascade" }),

    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.showcaseId, t.tagId] }),
  }),
);
