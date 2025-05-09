import { z } from "zod";
import { on } from "events";
import { TRPCError } from "@trpc/server";

import { ee, protectedProcedure } from "@/rpc/rpc-core";
import * as service from "@/game/game-service.ts";
import {
  timerToGameData,
  TimerDataPayload,
  PartialTimerPayload,
  partialTimerToGameData,
} from "./game-schemas";
import * as gameService from "@/game/game-service";

export const gameRoutes = {
  startSharing: protectedProcedure
    .input(z.object({ game: TimerDataPayload }))
    .mutation(async function ({ ctx, input }) {
      const userId = ctx.user.id;
      const sessionId = ctx.session.id;
      const oldGame = await service.getGame(userId, sessionId);
      const payload = timerToGameData(input.game);
      if (!oldGame) {
        const code = await service.createSharedGame(userId, sessionId, payload);
        return { code };
      }
      const { code } = await service.updateGame(userId, sessionId, payload);
      return { code };
    }),

  updateGame: protectedProcedure
    .input(z.object({ game: PartialTimerPayload }))
    .mutation(async function ({ ctx, input }) {
      const payload = partialTimerToGameData(input.game);

      const game = await service.updateGame(
        ctx.user.id,
        ctx.session.id,
        payload,
      );

      ee.emit(`gameUpdate:${game.id}`, game);

      return { success: true };
    }),

  connectToGame: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    const userId = ctx.user.id;
    const sessionId = ctx.session.id;
    const gameId = await gameService.getGameId(userId, sessionId);

    if (!gameId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Game not found",
      });
    }

    const remotes = await gameService.getGameRemotes(gameId);

    yield { remotes };

    for await (const [data] of on(ee, `remotes:${gameId}`, { signal })) {
      yield data as { id: string; name: string; connected: boolean }[];
    }
  }),
};
