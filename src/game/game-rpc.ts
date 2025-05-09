import { z } from "zod";
// import { on } from "events";
// import { TRPCError } from "@trpc/server";

import { ee, protectedProcedure } from "@/rpc/rpc-core";
import * as service from "@/game/game-service.ts";
import {
  timerToGameData,
  TimerDataPayload,
  PartialTimerPayload,
  partialTimerToGameData,
} from "./game-schemas";

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
};
