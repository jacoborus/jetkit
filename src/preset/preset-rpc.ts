import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { protectedProcedure } from "@/rpc/rpc-core";
import * as service from "@/preset/preset-service";
import * as schemas from "@/preset/preset-schemas";

const withId = z.object({
  id: z.string(),
});

export const presetRoutes = {
  listOwnPresets: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    const presets = await service.list(user.id);
    return presets;
  }),

  getPresetById: protectedProcedure.input(withId).query(async ({ input }) => {
    const { id } = input;
    const preset = await service.getById(id);
    if (!preset) {
      // Throw a trpc error
      throw new TRPCError({ code: "NOT_FOUND", message: "Not found" });
    }
    return preset;
  }),

  createPreset: protectedProcedure
    .input(schemas.PresetCreateSchema)
    .mutation(async function ({
      input,
      ctx,
    }): Promise<schemas.PresetSelectSchema> {
      const author = ctx.user;
      const preset = await service.create({ ...input, author: author.id });
      return preset;
    }),

  updatePreset: protectedProcedure
    .input(withId)
    .input(schemas.PresetUpdateSchema)
    .mutation(async function ({
      input,
      ctx,
    }): Promise<schemas.PresetSelectSchema> {
      const preset = await service.updateOwnPreset(
        input.id,
        ctx.user.id,
        input,
      );
      return preset;
    }),

  deletePreset: protectedProcedure.input(withId).mutation(async ({ input }) => {
    await service.remove(input.id);
    return true;
  }),
};
