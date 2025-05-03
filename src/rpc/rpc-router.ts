import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";

import { rpcContext } from "@/rpc/rpc-core";
import { chatRoutes } from "@/chat/chat-rpc";
import { todoRoutes } from "@/todo/todo-rpc";
import { userRoutes } from "@/user/user-rpc";
import auth from "@/auth/auth-service";

export type RpcRouter = typeof rpcRouter;
export const rpcRouter = rpcContext.router({
  user: userRoutes,
  chat: chatRoutes,
  todo: todoRoutes,
});

export const rpcRoute = new Hono().use(
  "*",
  trpcServer({
    router: rpcRouter,
    async createContext(opts) {
      const session = await auth.api.getSession({ headers: opts.req.headers });
      return session ?? { user: null, session: null };
    },
  }),
);
