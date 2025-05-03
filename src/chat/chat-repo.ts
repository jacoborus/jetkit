import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import userRepo from "@/user/user-repo";

export const chat = pgTable("chat_msg", {
  id: uuid().defaultRandom().primaryKey(),
  message: text("message").notNull(),
  author: uuid("author_id").references(() => userRepo.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageToUserRelations = relations(chat, ({ one }) => ({
  sender: one(userRepo, {
    fields: [chat.author],
    references: [userRepo.id],
  }),
}));
