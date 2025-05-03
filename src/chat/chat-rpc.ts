import { z } from "zod";
import db from "@/db/db";
import { chat as chatRepo } from "@/chat/chat-repo";
import { desc, lt } from "drizzle-orm";

import {
  ee,
  protectedProcedure,
  publicProcedure,
  rpcContext,
} from "@/rpc/rpc-core";

export type ChatRoutes = typeof chatRoutes;
export const chatRoutes = rpcContext.router({
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const msgs = await db
        .insert(chatRepo)
        .values({
          message: input.message,
          author: ctx.user.id,
        })
        .returning();

      ee.emit("newChat", { msg: msgs[0], user: ctx.user });
      return { success: true };
    }),

  getMessages: publicProcedure
    .input(
      z.object({
        before: z.string().datetime().optional(),
      }),
    )
    .query(async ({ input }) => {
      const messages = await db.query.chat.findMany({
        where: input.before
          ? lt(chatRepo.createdAt, new Date(input.before))
          : undefined,
        orderBy: [desc(chatRepo.createdAt)],
        limit: 20,
        with: {
          sender: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      return messages;
    }),
});
