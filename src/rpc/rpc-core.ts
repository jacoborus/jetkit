import EventEmitter from "events";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

import auth from "@/auth/auth-service";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";

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

export const createAuthedContext = async (
  opts: CreateWSSContextFnOptions | CreateHTTPContextOptions,
) => {
  const headers = convertListToHeaders(opts.req.rawHeaders);
  const session = await auth.api.getSession({ headers });
  return session ?? { user: null, session: null };
};

export type Context = Awaited<ReturnType<typeof createAuthedContext>>;

const t = initTRPC.context<Context>().create();

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

function convertListToHeaders(list: string[]): Headers {
  const headers = new Headers();
  for (let i = 0; i < list.length; i += 2) {
    const key = list[i];
    const value = list[i + 1];
    headers.append(key, value);
  }
  return headers;
}
