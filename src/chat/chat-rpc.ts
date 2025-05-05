import { z } from "zod";
import { on } from "events";
import db from "@/db/db";
import { chat as chatRepo } from "@/chat/chat-repo";
import { desc, lt } from "drizzle-orm";
import { MessageFull } from "./chat-schemas";

import { ee, protectedProcedure } from "@/rpc/rpc-core";

export type ChatRoutes = typeof chatRoutes;
export const chatRoutes = {
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
      const first = msgs[0];

      const result = {
        message: first.message,
        id: first.id,
        createdAt: first.createdAt,
        sender: {
          name: ctx.user.name,
          image: ctx.user.image,
        },
      } as MessageFull;

      ee.emit("newChat", result);
      return { success: true };
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        before: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const messages = await db.query.chat.findMany({
        where: input.before ? lt(chatRepo.createdAt, input.before) : undefined,
        columns: {
          message: true,
          id: true,
          createdAt: true,
        },
        orderBy: [desc(chatRepo.createdAt)],
        limit: 20,
        with: {
          sender: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
      });
      return messages;
    }),

  onNewMessage: protectedProcedure
    .input(
      z
        .object({
          before: z.string().datetime().optional(),
        })
        .optional(),
    )
    .subscription(async function* (opts) {
      for await (const [data] of on(ee, "newChat", { signal: opts.signal })) {
        yield data as MessageFull;
      }
    }),
};
