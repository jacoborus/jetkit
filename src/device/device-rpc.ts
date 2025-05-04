import { z } from "zod";
import { on } from "events";
import { TRPCError } from "@trpc/server";

import { ee, protectedProcedure, publicProcedure } from "@/rpc/rpc-core";
import * as service from "../device/device-service";
import { TimerData } from "../socket-messages";
import * as remoteService from "src/remote/remote-service";
import { DeviceUpdateSchema } from "./device-schemas";

const withId = z.object({
  id: z.string(),
});

export const deviceRoutes = {
  startSharing: protectedProcedure
    .input(TimerData)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { code, error } = await service.generateDevice(userId);

      if (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot generate device",
        });
      }

      const timerData = input;
      const { startedAt, pausedAt } = timerData;

      const device = await service.updateByUser(userId, {
        startedAt: startedAt === 0 ? undefined : new Date(startedAt),
        pausedAt: pausedAt === 0 ? undefined : new Date(pausedAt),
        level: timerData.level,
        running: timerData.running,
        levels: JSON.stringify(timerData.levels),
      });

      // const removeTrigger = remoteService.onRemoteUpdate(device.id, (data) => {
      //   conn.send(
      //     JSON.stringify({
      //       kind: "updatedRemote",
      //       data: {
      //         name: data.name,
      //         connected: data.connected,
      //         id: data.id,
      //       },
      //     }),
      //   );
      // });
      // conn.on("close", removeTrigger);

      return { code, deviceId: device.id };
    }),

  updateDevice: protectedProcedure
    .input(TimerData.partial())
    .mutation(async ({ ctx, input }) => {
      const timerData = input;

      const levelsObj = timerData.levels
        ? { levels: JSON.stringify(timerData.levels) }
        : {};

      const newTimerData = {
        startedAt: timerData.startedAt
          ? new Date(timerData.startedAt)
          : undefined,
        pausedAt: timerData.pausedAt ? new Date(timerData.pausedAt) : undefined,
        running: timerData.running,
        level: timerData.level,
        ...levelsObj,
      };

      await service.updateByUser(ctx.user.id, newTimerData);
      return { success: true };
    }),

  getRemotes: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      // TODO: check if user is owner of device
      const remotes = await remoteService.listBySharedDevice(input.deviceId);
      return { data: remotes };
    }),

  renameRemote: protectedProcedure
    .input(z.object({ remoteId: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      const { remoteId, name } = input;
      await remoteService.update(remoteId, { name });
      return { success: true };
    }),

  onDeviceUpdate: publicProcedure
    .input(withId)
    .subscription(async function* (opts) {
      for await (const [data] of on(ee, "todoUpdate", {
        signal: opts.signal,
      })) {
        const payload = data as DeviceUpdateSchema;
        yield payload;
      }
    }),
};
