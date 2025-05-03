import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import userRepo from "@/user/user-repo";

export const insertUserSchema = createInsertSchema(userRepo, {
  name: (schema) => schema.trim().min(3),
  email: (schema) => schema.trim().email(),
});

export const selectUserSchema = createSelectSchema(userRepo);

export type UserCreateRequest = z.infer<typeof userCreateRequest>;
export const userCreateRequest = z
  .object({
    password: z.string().min(8),
  })
  .merge(
    insertUserSchema.pick({
      name: true,
      email: true,
    }),
  );

export type UserSummary = z.infer<typeof userSummary>;
export const userSummary = selectUserSchema.pick({
  id: true,
  name: true,
  email: true,
  image: true,
});

export type UserDetails = z.infer<typeof userDetails>;
export const userDetails = selectUserSchema
  .pick({
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
  })
  .strict();

export const userDetailsFilter = selectUserSchema.pick({
  id: true,
  name: true,
  email: true,
  emailVerified: true,
});
