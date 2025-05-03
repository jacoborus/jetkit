import { pgTable as table, text, uuid } from "drizzle-orm/pg-core";

import userRepo from "@/user/user-repo";

export default table("todo", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("desc").default("").notNull(),
  author: uuid("author")
    .references(() => userRepo.id)
    .notNull(),
});
