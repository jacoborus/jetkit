import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import presetRepo from "./preset-repo";

export type PresetSchema = z.infer<typeof PresetSchema>;
export const PresetSchema = createSelectSchema(presetRepo, {
  name: (schema) => schema.trim(),
});

export type PresetSelectSchema = z.infer<typeof PresetSelectSchema>;
export const PresetSelectSchema = createSelectSchema(presetRepo, {
  name: (schema) => schema.trim(),
}).omit({ author: true });

export type PresetCreateSchema = z.infer<typeof PresetCreateSchema>;
export const PresetCreateSchema = createInsertSchema(presetRepo)
  .omit({ id: true, author: true })
  .required();

export type PresetUpdateSchema = z.infer<typeof PresetUpdateSchema>;
export const PresetUpdateSchema = createInsertSchema(presetRepo).omit({
  id: true,
  author: true,
});

export type PresetInsertSchema = z.infer<typeof PresetInsertSchema>;
export const PresetInsertSchema = createInsertSchema(presetRepo)
  .omit({ id: true })
  .required();
