import {
  pgTable as table,
  uuid,
  boolean,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import userRepo from "../user/user-repo";

export default table("device", {
  id: uuid("id").defaultRandom().primaryKey(),
  author: uuid("author")
    .unique()
    .references(() => userRepo.id)
    .notNull(),
  code: varchar("code").notNull(),
  active: boolean("active").default(false).notNull(),
  connected: boolean("connected").default(false).notNull(),
  running: boolean("running").default(false).notNull(),
  levels: text("levels").default("[]").notNull(),
  level: integer("level").default(0).notNull(),
  startedAt: timestamp("started_at"),
  pausedAt: timestamp("paused_at"),
});
