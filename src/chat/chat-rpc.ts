import { z } from "zod";
import { on } from "events";
import db from "@/db/db";
import { chat as chatRepo } from "@/chat/chat-repo";
import { desc, lt } from "drizzle-orm";

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

      ee.emit("newChat", {
        ...msgs[0],
        sender: { id: ctx.user.id, name: ctx.user.name, image: ctx.user.image },
      });
      return { success: true };
    }),

  getMessages: protectedProcedure
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

  onNewMessage: protectedProcedure.subscription(async function* (opts) {
    for await (const [data] of on(ee, "newChat", { signal: opts.signal })) {
      // const payload = data as TodoPayload;
      // yield payload;
      yield data;
    }
  }),
};
