import EventEmitter from "events";
import { initTRPC, TRPCError } from "@trpc/server";

import auth from "@/auth/auth-service";

export type AuthEnv =
  | {
      user: null;
      session: null;
    }
  | {
      user: typeof auth.$Infer.Session.user;
      session: typeof auth.$Infer.Session.session;
    };

export const ee = new EventEmitter();

const t = initTRPC.context<AuthEnv>().create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function (opts) {
  if (!opts.ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Only authenticated users",
    });
  }
  return opts.next({ ctx: opts.ctx });
});

export const adminProcedure = t.procedure.use(async function (opts) {
  if (!opts.ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Only authenticated users",
    });
  }
  if (opts.ctx.user.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Only admin users" });
  }
  return opts.next({ ctx: opts.ctx });
});

export const rpcContext = t;
