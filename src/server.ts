import { Hono } from "hono";
import { WebSocketServer } from "ws";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import { prettyJSON } from "hono/pretty-json";
import { serve, ServerType } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";

import config from "@/config";
import { authRouter } from "@/auth/auth-routes";
import { rpcServer } from "@/rpc/rpc-server";
import { wss } from "@/rpc/rpc-server";

const isProd = process.env["NODE_ENV"] === "production";

let html = await readFile(
  isProd ? "dist/index.html" : "src/index.html",
  "utf8",
);

console.log(`Running on prod? => ${isProd}`);

if (!isProd) {
  html = html.replace(
    "<head>",
    `
    <script type="module" src="/@vite/client"></script>
    <script type="module">
      import RefreshRuntime from "/@react-refresh";
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    </script>
    `,
  );
}

const app = new Hono();
export default app;

app.use(
  "*",
  cors({
    origin: config.BASE_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app
  .use("*", compress())
  .use("*", prettyJSON())
  .use("*", logger())
  .use("/*", serveStatic({ root: isProd ? "dist/" : "./" }))
  .use("/assets/*", serveStatic({ root: isProd ? "dist/assets" : "./" }))
  .use("/dist/*", serveStatic({ root: "dist/" }))
  .route("/auth", authRouter)
  .route("/rpc", rpcServer)
  .get("reset-password", (c) => {
    return c.redirect(
      `http://localhost:5173/reset-password?token=${c.req.query("token")}`,
    );
  })
  .get("/*", (c) => c.html(html));

interface GlobalThis {
  oldWss: WebSocketServer;
  oldServe: ServerType;
}
const glob: GlobalThis = globalThis as unknown as GlobalThis;

if (!isProd) {
  const oldWss = glob.oldWss as WebSocketServer;
  const oldServe = glob.oldServe as ServerType;
  if (oldWss) oldWss.close();
  if (oldServe) oldServe.close();
}

const serveOpts = isProd
  ? { fetch: app.fetch, port: config.API_PORT }
  : { fetch: new Hono().fetch, port: 3001 };

const server = serve(serveOpts, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});

if (!isProd) {
  glob.oldWss = wss;
  glob.oldServe = server;
}

server.on("upgrade", (request, socket, head) => {
  if (request.url !== "/rpc") {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
