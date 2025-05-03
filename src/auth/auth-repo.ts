import {
  index,
  timestamp,
  pgTable as table,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import userRepo from "@/user/user-repo";
import { relations } from "drizzle-orm";

export const session = table(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    impersonatedBy: uuid("impersonated_by"),
    userId: uuid("user_id")
      .notNull()
      .references(() => userRepo.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_userid_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ],
);

export const sessionToUserRelations = relations(session, ({ one }) => ({
  user: one(userRepo, {
    fields: [session.userId],
    references: [userRepo.id],
  }),
}));

export const account = table(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userRepo.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [index("account_userid_idx").on(table.userId)],
);

export const verification = table(
  "verification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [index("verif_ident_idx").on(table.identifier)],
);

export const role = table("role", {
  id: varchar("id", { length: 256 }).primaryKey(),
});
