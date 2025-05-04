import { eq, and } from "drizzle-orm";
import db from "../db/db";
import deviceRepo from "./device-repo";
import * as schemas from "./device-schemas";

interface ListOptions {
  limit?: number;
  offset?: number;
}

interface InputDevice {
  code: string;
  error?: Error;
}

export async function getByUser(id: string) {
  return await db.query.device.findFirst({
    where: (device, { eq }) => eq(device.author, id),
  });
}

export async function getByCode(code: string) {
  const device = await db.query.device.findFirst({
    where: (device, { eq }) => eq(device.code, code.toLowerCase()),
  });
  return device;
}

export async function generateDevice(userId: string): Promise<InputDevice> {
  const result = {
    code: "",
    error: undefined as undefined | Error,
  };
  try {
    const deviceData = await getByUser(userId);
    if (deviceData) {
      result.code = deviceData.code;
      await updateByUser(userId, { connected: true });
      return result;
    }

    const newDevice = await create({
      author: userId,
      connected: true,
    });
    result.code = newDevice.code;
    return result;
  } catch (e) {
    const err = e as unknown as Error;
    console.log(e);
    result.error = err;
    return result;
  }
}

export async function updateByUser(
  userId: string,
  payload: schemas.DeviceUpdateSchema,
) {
  const updatedDevice = await db
    .update(deviceRepo)
    .set({ ...payload })
    .where(and(eq(deviceRepo.author, userId)))
    .returning();
  const device = updatedDevice[0];
  emitDeviceUpdate(device.id, payload);
  return device;
}

// CRUDL
export async function create(payload: schemas.DeviceInsertSchema) {
  const code = payload.code || Math.random().toString(16).slice(2, 8);
  const devices = await db
    .insert(deviceRepo)
    .values({ ...payload, code })
    .returning();
  const device = schemas.DeviceSelectSchema.parse(devices[0]);
  return device;
}

export async function getById(id: string) {
  return await db.query.device.findFirst({
    where: (device, { eq }) => eq(device.id, id),
  });
}

export async function update(id: string, payload: schemas.DeviceUpdateSchema) {
  const updatedDevice = await db
    .update(deviceRepo)
    .set({ ...payload })
    .where(and(eq(deviceRepo.id, id)))
    .returning();
  const device = updatedDevice[0];
  emitDeviceUpdate(id, payload);
  return device;
}

export async function remove(id: string) {
  await db.delete(deviceRepo).where(eq(deviceRepo.id, id));
}

export async function list(userId: string, options?: ListOptions) {
  return await db.query.device.findMany({
    columns: { author: false },
    where: (device, { eq }) => eq(device.author, userId),
    limit: options?.limit,
    offset: options?.offset,
  });
}

type Trigger = (payload: schemas.DeviceUpdateSchema) => void;

const register = new Map<string, Set<Trigger>>();

export function onDeviceUpdate(id: string, trigger: Trigger) {
  let stack = register.get(id);
  if (!stack) {
    stack = new Set();
    register.set(id, stack);
  }

  const cleanup = () => {
    stack.delete(trigger);
    if (stack.size === 0) register.delete(id);
  };

  if (stack.has(trigger)) return cleanup;

  stack.add(trigger);
  return cleanup;
}

function emitDeviceUpdate(id: string, payload: schemas.DeviceUpdateSchema) {
  const stack = register.get(id);
  if (!stack) return;
  stack.forEach((trigger) => trigger(payload));
}
