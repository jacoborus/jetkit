import { z } from "zod";
import { on } from "events";
import { TRPCError } from "@trpc/server";

import { ee, publicProcedure } from "@/rpc/rpc-core";
import * as gameService from "@/game/game-service";
import { GameUpdate } from "@/game/game-schemas";

export type GuestLoginResponse = z.infer<typeof GuestLoginResponse>;
const GuestLoginResponse = z.object({
  remoteId: z.string(),
  name: z.string(),
  sharedDevice: z.string(),
});

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

      yield {
        connected: game.connected,
        running: game.running,
        levels: game.levels,
        level: game.level,
        startedAt: game.startedAt,
        pausedAt: game.pausedAt,
      };

      for await (const [data] of on(ee, `gameUpdate:${game.id}`, { signal })) {
        yield data as GameUpdate;
      }
    }),
};
