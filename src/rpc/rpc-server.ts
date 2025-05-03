import { Hono } from "hono";
import { WebSocketServer } from "ws";
import { trpcServer } from "@hono/trpc-server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

import { rpcRouter, type RpcRouter } from "@/rpc/rpc-router";
import auth from "@/auth/auth-service";

export const rpcServer = new Hono().use(
  "*",
  trpcServer({
    router: rpcRouter,
    async createContext(opts) {
      const session = await auth.api.getSession({ headers: opts.req.headers });
      return session ?? { user: null, session: null };
    },
  }),
);

export const wss = new WebSocketServer({ noServer: true });

applyWSSHandler<RpcRouter>({
  wss,
  router: rpcRouter,
  keepAlive: {
    enabled: true,
    pingMs: 30000,
    pongWaitMs: 5000,
  },
  async createContext(opts) {
    const headers = convertListToHeaders(opts.req.rawHeaders);
    const session = await auth.api.getSession({ headers });
    return session ?? { user: null, session: null };
  },
});

function convertListToHeaders(list: string[]): Headers {
  const headers = new Headers();
  for (let i = 0; i < list.length; i += 2) {
    const key = list[i];
    const value = list[i + 1];
    headers.append(key, value);
  }
  return headers;
}
