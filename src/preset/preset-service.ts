import { eq, and } from "drizzle-orm";
import db from "../db/db";
import presetRepo from "./preset-repo";
import * as schemas from "./preset-schemas";

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function create(payload: schemas.PresetInsertSchema) {
  const presets = await db.insert(presetRepo).values(payload).returning();
  const preset = schemas.PresetSelectSchema.parse(presets[0]);
  return preset;
}

export async function getById(id: string) {
  return await db.query.preset.findFirst({
    where: (preset, { eq }) => eq(preset.id, id),
  });
}

export async function getByIdAndUser(id: string, userId: string) {
  return await db.query.preset.findFirst({
    where: (preset, { eq, and }) =>
      and(eq(preset.id, id), eq(preset.author, userId)),
  });
}

export async function update(id: string, payload: schemas.PresetUpdateSchema) {
  const updatedPreset = await db
    .update(presetRepo)
    .set({ ...payload })
    .where(and(eq(presetRepo.id, id)))
    .returning();
  return updatedPreset[0];
}

export async function updateOwnPreset(
  id: string,
  userId: string,
  payload: schemas.PresetUpdateSchema,
) {
  const updatedPreset = await db
    .update(presetRepo)
    .set({ ...payload })
    .where(and(eq(presetRepo.id, id), eq(presetRepo.author, userId)))
    .returning();
  return updatedPreset[0];
}

export async function remove(id: string) {
  await db.delete(presetRepo).where(eq(presetRepo.id, id));
}

export async function list(userId: string, options?: ListOptions) {
  return await db.query.preset.findMany({
    columns: { author: false },
    where: (preset, { eq }) => eq(preset.author, userId),
    limit: options?.limit,
    offset: options?.offset,
  });
}
