import { z } from "zod";

import { protectedProcedure, adminProcedure, rpcContext } from "@/rpc/rpc-core";
import * as service from "./user-service";

const withId = z.object({
  id: z.string(),
});

export type UserRoutes = typeof userRoutes;
export const userRoutes = rpcContext.router({
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
});
