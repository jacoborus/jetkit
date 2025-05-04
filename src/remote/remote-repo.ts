import { pgTable as table, uuid, boolean, varchar } from "drizzle-orm/pg-core";

import deviceRepo from "../device/device-repo";

export interface RemoteDisplay {
  id: string;
  name: string;
  connected: boolean;
  shared_display: string;
}

export default table("remote", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  connected: boolean("connected").default(false).notNull(),
  sharedDevice: uuid("sharedDevice")
    .references(() => deviceRepo.id)
    .notNull(),
});
