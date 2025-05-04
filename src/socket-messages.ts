import z from "zod";

const SocketMsg = z.object({
  kind: z.string(),
  data: z.unknown(),
});
type SocketMsg = z.infer<typeof SocketMsg>;

export const LoginMsg = SocketMsg.extend({
  kind: z.literal("login"),
  data: z.string(),
});
export type LoginMsg = z.infer<typeof LoginMsg>;

export const LoginResp = z.object({
  kind: z.literal("loginResp"),
  data: z.boolean(),
});

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
export const GameLevels = z.array(z.union([Level, Break]));
export type GameLevels = z.infer<typeof GameLevels>;

export const TimerData = z.object({
  startedAt: z.number(),
  pausedAt: z.number(),
  running: z.boolean(),
  level: z.number(),
  levels: GameLevels,
  code: z.string(),
});
export type TimerData = z.infer<typeof TimerData>;
