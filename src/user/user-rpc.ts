import { z } from "zod";

import { protectedProcedure, adminProcedure } from "@/rpc/rpc-core";
import * as service from "./user-service";

const withId = z.object({
  id: z.string(),
});

export type UserRoutes = typeof userRoutes;

export const userRoutes = {
  listUsers: adminProcedure.query(async () => {
    const users = await service.getAllDetails();
    return users;
  }),

  getUserSummary: protectedProcedure.input(withId).query(async ({ input }) => {
    const user = await service.getById(input.id);
    return user;
  }),

  getUserDetails: protectedProcedure.input(withId).query(async ({ input }) => {
    const user = await service.getUserDetails(input.id);
    return user;
  }),

  removeUser: adminProcedure.input(withId).mutation(async ({ input }) => {
    await service.remove(input.id);
    return true;
  }),

  changeRole: adminProcedure
    .input(withId.extend({ role: z.enum(["admin", "regular"]) }))
    .mutation(
      async ({ input }) => (await service.changeRole(input.id, input.role))[0],
    ),
};
