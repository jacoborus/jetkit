import { z } from "zod";
import { on } from "events";
import { TRPCError } from "@trpc/server";

import { ee, publicProcedure } from "@/rpc/rpc-core";
import * as gameService from "@/game/game-service";
import { GameUpdate } from "@/game/game-schemas";

export const remoteRoutes = {
  connectToGame: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .subscription(async function* ({ input, signal }) {
      const game = await gameService.getGameByCode(input.code);
      if (!game) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }

      try {
        yield {
          connected: game.connected,
          level: game.level,
          levels: game.levels,
          pausedAt: game.pausedAt,
          running: game.running,
          startedAt: game.startedAt,
        };

        for await (const [data] of on(ee, `gameUpdate:${game.id}`, {
          signal,
        })) {
          yield data as GameUpdate;
        }
      } finally {
        console.log(
          `Client unsubscribed from game ${game.id}. Signal aborted: ${signal?.aborted}`,
        );
      }
    }),
};
