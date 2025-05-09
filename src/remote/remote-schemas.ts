import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import remoteRepo from "./remote-repo";

export type RemoteSchema = z.infer<typeof RemoteSchema>;
export const RemoteSchema = createSelectSchema(remoteRepo, {});

export type RemoteSelectSchema = z.infer<typeof RemoteSelectSchema>;
export const RemoteSelectSchema = createSelectSchema(remoteRepo);

export type RemoteCreateSchema = z.infer<typeof RemoteCreateSchema>;
export const RemoteCreateSchema = createInsertSchema(remoteRepo)
  .omit({ id: true, connected: true })
  .required();

export type RemoteUpdateSchema = z.infer<typeof RemoteUpdateSchema>;
export const RemoteUpdateSchema = createInsertSchema(remoteRepo)
  .partial()
  .omit({ id: true });

export type RemoteInsertSchema = z.infer<typeof RemoteInsertSchema>;
export const RemoteInsertSchema = createInsertSchema(remoteRepo)
  .omit({ id: true })
  .required();

export type RemoteDeviceSelectSchema = z.infer<typeof RemoteDeviceSelectSchema>;
export const RemoteDeviceSelectSchema = createSelectSchema(remoteRepo).omit({
  gameId: true,
});
