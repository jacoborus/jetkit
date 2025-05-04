import { rpcContext } from "@/rpc/rpc-core";
import { userRoutes } from "@/user/user-rpc";
import { presetRoutes } from "@/preset/preset-rpc";

export type RpcRouter = typeof rpcRouter;
export const rpcRouter = rpcContext.router({
  user: userRoutes,
  preset: presetRoutes,
});
