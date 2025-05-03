import { rpcContext } from "@/rpc/rpc-core";
import { chatRoutes } from "@/chat/chat-rpc";
import { todoRoutes } from "@/todo/todo-rpc";
import { userRoutes } from "@/user/user-rpc";

export type RpcRouter = typeof rpcRouter;
export const rpcRouter = rpcContext.router({
  user: userRoutes,
  chat: chatRoutes,
  todo: todoRoutes,
});
