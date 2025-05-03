import {
  boolean,
  index,
  pgTable as table,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { role as roleRepo } from "../auth/auth-repo";

export default table(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    emailVerified: boolean("verif_email").default(false).notNull(),
    image: text("image"),
    role: text("role")
      .default("regular")
      .notNull()
      .references(() => roleRepo.id),
    banned: boolean("banned").default(false).notNull(),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)],
);
