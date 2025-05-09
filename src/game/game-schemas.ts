import { z } from "zod";
import {
  // createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import gameRepo from "@/game/game-repo";
import { GameLevels, TimerData } from "@/lib/front-schemas";
// import { GameLevels, TimerData } from "@tpc/schemas";

export type GameSchema = z.infer<typeof GameSchema>;
export const GameSchema = createSelectSchema(gameRepo);

export type GameSelect = z.infer<typeof GameSelect>;
export const GameSelect = createSelectSchema(gameRepo).omit({
  userId: true,
  sessionId: true,
});

export type GameUpdate = z.infer<typeof GameUpdate>;
export const GameUpdate = createUpdateSchema(gameRepo).omit({
  id: true,
  userId: true,
  sessionId: true,
});

export type GameData = z.infer<typeof GameData>;
export const GameData = GameSelect.omit({
  id: true,
  code: true,
  connected: true,
  capacity: true,
});

export type TimerDataPayload = z.infer<typeof TimerDataPayload>;
export const TimerDataPayload = TimerData.extend({
  startedAt: TimerData.shape.startedAt.nullable(),
  pausedAt: TimerData.shape.pausedAt.nullable(),
});

export function timerToGameData(timer: TimerDataPayload): GameData {
  if (timer.levels) {
    GameLevels.parse(timer.levels);
  }
  return {
    running: timer.running,
    levels: JSON.stringify(timer.levels),
    level: timer.level,
    startedAt: timer.startedAt ? new Date(timer.startedAt) : null,
    pausedAt: timer.pausedAt ? new Date(timer.pausedAt) : null,
  };
}

export type PartialTimerPayload = z.infer<typeof PartialTimerPayload>;
export const PartialTimerPayload = TimerDataPayload.partial();

export function partialTimerToGameData(
  timer: PartialTimerPayload,
): Partial<GameData> {
  if (timer.levels) {
    GameLevels.parse(timer.levels);
  }
  return {
    running: timer.running,
    levels: JSON.stringify(timer.levels),
    level: timer.level,
    startedAt: timer.startedAt ? new Date(timer.startedAt) : null,
    pausedAt: timer.pausedAt ? new Date(timer.pausedAt) : null,
  };
}
