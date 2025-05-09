import { eq, and } from "drizzle-orm";

import db from "@/db/db";
import gameRepo from "@/game/game-repo";
import { GameData, GameSelect } from "./game-schemas";

export async function createSharedGame(
  userId: string,
  sessionId: string,
  payload: GameData,
) {
  const code = Math.random().toString(16).slice(2, 8);

  const games = await db
    .insert(gameRepo)
    .values({
      ...payload,
      code,
      connected: true,
      userId: userId,
      sessionId,
    })
    .returning({
      code: gameRepo.code,
    });

  return games[0].code;
}

export async function updateGame(
  userId: string,
  sessionId: string,
  payload: Partial<GameData>,
): Promise<GameSelect> {
  const updatedGame = await db
    .update(gameRepo)
    .set(payload)
    .where(and(eq(gameRepo.userId, userId), eq(gameRepo.sessionId, sessionId)))
    .returning({
      id: gameRepo.id,
      code: gameRepo.code,
      capacity: gameRepo.capacity,
      connected: gameRepo.connected || true,
      running: gameRepo.running,
      levels: gameRepo.levels,
      level: gameRepo.level,
      startedAt: gameRepo.startedAt,
      pausedAt: gameRepo.pausedAt,
    });
  return updatedGame[0];
}

export async function getGameByCode(code: string) {
  return await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.code, code),
    columns: {
      id: true,
      connected: true,
      running: true,
      levels: true,
      level: true,
      startedAt: true,
      pausedAt: true,
    },
  });
}

export async function getGame(userId: string, sessionId: string) {
  return await db.query.game.findFirst({
    where: (game, { eq, and }) =>
      and(eq(game.userId, userId), eq(game.sessionId, sessionId)),
    columns: {
      id: true,
      connected: true,
      running: true,
      levels: true,
      level: true,
      startedAt: true,
      pausedAt: true,
    },
  });
}

export async function getGameId(userId: string, sessionId: string) {
  const game = await db.query.game.findFirst({
    where: (game, { eq, and }) =>
      and(eq(game.userId, userId), eq(game.sessionId, sessionId)),
    columns: {
      id: true,
    },
  });
  if (!game) return null;
  return game.id;
}

export async function getGameRemotes(gameId: string) {
  const remotes = await db.query.remote.findMany({
    where: (remote, { eq, and }) => and(eq(remote.gameId, gameId)),
    columns: {
      id: true,
      name: true,
      connected: true,
    },
  });

  return remotes;
}
