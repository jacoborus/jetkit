import { z } from "zod";
import { generateId } from "@/lib/util";

export const Level = z.object({
  id: z.string(),
  type: z.literal("game"),
  blinds: z.tuple([z.number(), z.number()]),
  ante: z.number(),
  duration: z.number(),
});
export type Level = z.infer<typeof Level>;

export const Break = z.object({
  id: z.string(),
  type: z.literal("break"),
  duration: z.number(),
});
export type Break = z.infer<typeof Break>;

export const QuickConf = z.object({
  duration: z.number(),
  initBlinds: z.number(),
  withBreaks: z.boolean(),
  breakDuration: z.number(),
  breakInterval: z.number(),
});
export type QuickConf = z.infer<typeof QuickConf>;

export const CustomConf = z.object({
  withAnte: z.boolean(),
  baseBreakDuration: z.number(),
  lockLevelDuration: z.boolean(),
  baseLevelDuration: z.number(),
});
export type CustomConf = z.infer<typeof CustomConf>;

export const BreaksConf = z.object({
  withBreaks: z.boolean(),
  autoBreaks: z.boolean(),
  breakDuration: z.number(),
  breakInterval: z.number(),
});
export type BreaksConf = z.infer<typeof BreaksConf>;

export const GameLevels = z.array(z.union([Level, Break]));
export type GameLevels = z.infer<typeof GameLevels>;

export type TimerData = z.infer<typeof TimerData>;
export const TimerData = z.object({
  startedAt: z.number().nullable(),
  pausedAt: z.number().nullable(),
  running: z.boolean(),
  level: z.number(),
  levels: GameLevels,
  code: z.string(),
});

export function getDefaultTimerData(): TimerData {
  return {
    startedAt: 0,
    pausedAt: 0,
    running: false,
    level: 0,
    levels: [],
    code: "",
  };
}

export function getDefaultCustomConf(): CustomConf {
  return {
    withAnte: false,
    baseBreakDuration: 20,
    lockLevelDuration: true,
    baseLevelDuration: 15,
  };
}

export function getDefaultQuickConf(): QuickConf {
  return {
    duration: 10,
    initBlinds: 3,
    withBreaks: false,
    breakDuration: 20,
    breakInterval: 5,
  };
}

export function getLevel(target?: Level): Level {
  if (target) return { ...target, blinds: [...target.blinds] };
  return {
    id: generateId(),
    blinds: [100, 200],
    ante: 0,
    duration: 20,
    type: "game",
  };
}

export function getBreak(target?: Break): Break {
  if (target) return { ...target };
  return {
    id: generateId(),
    duration: 15,
    type: "break",
  };
}
