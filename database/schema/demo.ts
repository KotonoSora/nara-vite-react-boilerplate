import { integer, sqliteTable,  } from "drizzle-orm/sqlite-core";

export const demo = sqliteTable("demo", {
  id: integer().primaryKey({ autoIncrement: true }),
});
