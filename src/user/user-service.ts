import { eq } from "drizzle-orm";

import db from "@/db/db";
import userRepo from "./user-repo";
import * as schemas from "./user-schemas";

export async function getById(id: string) {
  return await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });
}

export async function getByEmail(email: string) {
  return await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });
}

export async function getUserIdByEmail(email: string) {
  return await db.query.user.findFirst({
    columns: { id: true },
    where: (user, { eq }) => eq(user.email, email),
  });
}

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function getAllDetails(
  options?: ListOptions,
): Promise<schemas.UserDetails[]> {
  return await db.query.user.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      banned: true,
      banReason: true,
      banExpires: true,
    },
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function getUserDetails(id: string) {
  return await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      banned: true,
      banReason: true,
      banExpires: true,
    },
  });
}
type NewUser = typeof userRepo.$inferInsert;

export async function create(payload: schemas.UserCreateRequest) {
  const now = new Date();
  const users = await db
    .insert(userRepo)
    .values({
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    } as unknown as NewUser)
    .returning();

  return users[0];
}

export async function remove(id: string) {
  return await db.delete(userRepo).where(eq(userRepo.id, id)).returning();
}
