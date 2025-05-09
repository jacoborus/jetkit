import {
  boolean,
  index,
  integer,
  pgTable as table,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import userRepo from "../user/user-repo";
import { session as sessionRepo } from "../auth/auth-repo";

export default table(
  "game",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("owner_id")
      .unique()
      .references(() => userRepo.id)
      .notNull(),
    sessionId: uuid("session_id")
      .unique()
      .references(() => sessionRepo.id)
      .notNull(),
    code: varchar("code").unique().notNull(),
    capacity: integer("capacity").default(5).notNull(),
    connected: boolean("connected").default(false).notNull(),
    running: boolean("running").default(false).notNull(),
    levels: text("levels").default("[]").notNull(),
    level: integer("level").default(0).notNull(),
    startedAt: timestamp("started_at"),
    pausedAt: timestamp("paused_at"),
  },
  (table) => [
    index("game_user_idx").on(table.userId),
    index("game_session_idx").on(table.sessionId),
  ],
);
