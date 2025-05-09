import { rpcContext } from "@/rpc/rpc-core";
import { userRoutes } from "@/user/user-rpc";
import { presetRoutes } from "@/preset/preset-rpc";
import { gameRoutes } from "@/game/game-rpc";
import { remoteRoutes } from "@/remote/remote-rpc";

export type RpcRouter = typeof rpcRouter;
export const rpcRouter = rpcContext.router({
  user: userRoutes,
  preset: presetRoutes,
  game: gameRoutes,
  remote: remoteRoutes,
});
