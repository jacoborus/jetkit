import { Hono } from "hono";
import { type AuthEnv } from "@/auth/auth-middleware";
import auth from "@/auth/auth-service";
import { authMiddleware } from "@/auth/auth-middleware";

export const authRouter = new Hono<AuthEnv>();

authRouter.on(["POST", "GET"], "*", authMiddleware, (c) => {
  return auth.handler(c.req.raw);
});
