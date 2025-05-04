import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import deviceRepo from "./device-repo";

export type DeviceSchema = z.infer<typeof DeviceSchema>;
export const DeviceSchema = createSelectSchema(deviceRepo, {});

export type DeviceSelectSchema = z.infer<typeof DeviceSelectSchema>;
export const DeviceSelectSchema = createSelectSchema(deviceRepo).omit({
  author: true,
});

export type DeviceCreateSchema = z.infer<typeof DeviceCreateSchema>;
export const DeviceCreateSchema = createInsertSchema(deviceRepo)
  .omit({ id: true, author: true, connected: true })
  .required();

export type DeviceUpdateSchema = z.infer<typeof DeviceUpdateSchema>;
export const DeviceUpdateSchema = createInsertSchema(deviceRepo)
  .omit({ id: true, author: true })
  .partial({ code: true });

export type DeviceInsertSchema = z.infer<typeof DeviceInsertSchema>;
export const DeviceInsertSchema = createInsertSchema(deviceRepo)
  .omit({ id: true })
  .partial({ code: true });
