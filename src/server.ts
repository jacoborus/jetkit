import { Hono } from "hono";
import { WebSocketServer } from "ws";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import { prettyJSON } from "hono/pretty-json";
import { serve, ServerType } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

import config from "@/config";
import { authRouter } from "@/auth/auth-routes";
import { rpcRouter, rpcRoute, RpcRouter } from "@/rpc/rpc-router";
import { createAuthedContext } from "@/rpc/rpc-core";

const isProd = process.env["NODE_ENV"] === "production";
let html = await readFile(isProd ? "dist/index.html" : "index.html", "utf8");

console.log(`Running on prod? => ${isProd}`);

if (!isProd) {
  html = html.replace(
    "<head>",
    `
  <script type="module" src="/@vite/client"></script>
  `,
  );
}

const app = new Hono();

const wss = new WebSocketServer({ noServer: true });

applyWSSHandler<RpcRouter>({
  wss,
  router: rpcRouter,
  keepAlive: {
    enabled: true,
    pingMs: 30000,
    pongWaitMs: 5000,
  },
  createContext: createAuthedContext,
});

app.use(
  "*",
  cors({
    // TODO: move to config
    origin: config.BASE_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", compress());
app.use("*", prettyJSON());
app.use("*", logger());

app
  .use("/*", serveStatic({ root: isProd ? "dist/" : "./" }))
  .use("/assets/*", serveStatic({ root: isProd ? "dist/assets" : "./" }))
  .use("/dist/*", serveStatic({ root: "dist/" }))
  .route("/auth", authRouter)
  .route("/rpc", rpcRoute)
  .get("/*", (c) => c.html(html));

app.get("reset-password", (c) => {
  return c.redirect(
    `http://localhost:5173/reset-password?token=${c.req.query("token")}`,
  );
});

export default app;

if (isProd) {
  const server = serve({ fetch: app.fetch, port: config.API_PORT }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });

  server.on("upgrade", (request, socket, head) => {
    if (request.url !== "/rpc") {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
} else {
  interface GlobalThis {
    oldWss: WebSocketServer;
    oldServe: ServerType;
  }
  const glob: GlobalThis = globalThis as unknown as GlobalThis;
  const oldWss = glob.oldWss as WebSocketServer;
  const oldServe = glob.oldServe as ServerType;

  if (oldWss) {
    oldWss.close();
  }
  if (oldServe) {
    oldServe.close();
  }

  const server2 = serve({ fetch: new Hono().fetch, port: 3001 }, () => {
    console.log(`listening to WS - http://localhost:${3001}`);
  });

  glob.oldWss = wss;
  glob.oldServe = server2;

  server2.on("upgrade", (request, socket, head) => {
    if (request.url !== "/rpc") {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
}
