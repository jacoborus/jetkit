import { eq, and } from "drizzle-orm";

import db from "../db/db";
import remoteRepo from "./remote-repo";
import * as schemas from "./remote-schemas";
import * as deviceService from "../device/device-service";

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function create(payload: schemas.RemoteInsertSchema) {
  const remotes = await db.insert(remoteRepo).values(payload).returning();
  const remote = schemas.RemoteSelectSchema.parse(remotes[0]);
  return remote;
}

export async function read(id: string) {
  return await db.query.remote.findFirst({
    where: (remote, { eq }) => eq(remote.id, id),
  });
}

export async function listBySharedDevice(sharedDeviceId: string) {
  return await db.query.remote.findMany({
    where: (remote, { eq, and }) =>
      and(eq(remote.sharedDevice, sharedDeviceId)),
    columns: {
      id: true,
      name: true,
      connected: true,
    },
  });
}

export async function update(id: string, payload: schemas.RemoteUpdateSchema) {
  const updatedRemote = await db
    .update(remoteRepo)
    .set({ ...payload })
    .where(and(eq(remoteRepo.id, id)))
    .returning();
  const remote = updatedRemote[0];
  emitRemoteUpdate(remote.sharedDevice, remote);
  return remote;
}

export async function remove(id: string) {
  await db.delete(remoteRepo).where(eq(remoteRepo.id, id));
}

export async function list(options?: ListOptions) {
  return await db.query.remote.findMany({
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function generateRemote(code: string, remoteId?: string) {
  try {
    const deviceData = await deviceService.getByCode(code);
    if (!deviceData) return { error: "Device not found" };

    if (remoteId) {
      const remote = await read(remoteId);
      if (remote) return { remote };
    }

    const remote = await create({
      connected: true,
      name: "",
      sharedDevice: deviceData.id,
    });

    return { remote };
  } catch (e) {
    const err = e as unknown as Error;
    console.log(err);
    return { error: err.message };
  }
}

type Trigger = (payload: schemas.RemoteSchema) => void;

const register = new Map<string, Set<Trigger>>();

export function onRemoteUpdate(id: string, trigger: Trigger) {
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

export function emitRemoteUpdate(
  sharedDeviceId: string,
  payload: schemas.RemoteSchema,
) {
  const stack = register.get(sharedDeviceId);
  if (!stack) return;
  stack.forEach((trigger) => trigger(payload));
}
