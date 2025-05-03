import { createMiddleware } from "hono/factory";
// import { tokenTypes, verifyToken } from "./token-service";
// import * as sessionService from "./session-service";
// import { getById } from "@/user/user-service";
import auth from "@/auth/auth-service";

export interface AuthEnv {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
}

export interface MaybeAuthEnv {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

export const authMiddleware = createMiddleware<MaybeAuthEnv>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  },
);

export const requireAuthMiddleware = createMiddleware<AuthEnv>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.status(401);
      return c.json({ error: "Unauthorized" });
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  },
);

export const requireAdminMiddleware = createMiddleware<AuthEnv>(
  async (c, next) => {
    const user = c.get("user");

    if (!user) {
      c.status(401);
      return c.json({ error: "Unauthorized" });
    }

    // if (user.role !== "admin") {
    //   c.status(403);
    //   return c.json({ error: "Forbidden" });
    // }

    await next();
  },
);
