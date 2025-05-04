import {
  pgTable as table,
  text,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

import userRepo from "../user/user-repo";

export default table("preset", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("title").default("").notNull(),
  author: uuid("author")
    .references(() => userRepo.id)
    .notNull(),
  levels: text("levels").default("[]").notNull(),
  withAnte: boolean("with_ante").default(false).notNull(),
  lockLevelDuration: boolean("lock_level_duration").default(false).notNull(),
  baseBreakDuration: integer("base_break_duration").default(10).notNull(),
  baseLevelDuration: integer("base_level_duration").default(25).notNull(),
});
