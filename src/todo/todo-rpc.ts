import { z } from "zod";
import { on } from "events";

import { protectedProcedure, rpcContext, ee } from "@/rpc/rpc-core";
import * as service from "./todo-service";
import * as schemas from "./todo-schemas";

export type TodoPayload = ["create", schemas.Todo] | ["delete", string];

export type TodoRoutes = typeof todoRoutes;
export const todoRoutes = rpcContext.router({
  listTodos: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    const todos = await service.list(user?.id);
    return todos;
  }),

  getTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      const todo = await service.getById(input.id, user.id);
      return todo;
    }),

  createTodo: protectedProcedure
    .input(schemas.todoCreateRequest)
    .mutation(async ({ ctx, input }) => {
      const author = ctx.user;
      const todo = await service.create({ ...input, author: author.id });
      ee.emit("todoUpdate", ["create", todo]);
      return todo;
    }),

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      await service.remove(input.id, user.id);
      ee.emit("todoUpdate", ["delete", input.id]);
      return true;
    }),

  onTodoUpdates: protectedProcedure.subscription(async function* (opts) {
    for await (const [data] of on(ee, "todoUpdate", { signal: opts.signal })) {
      const payload = data as TodoPayload;
      yield payload;
    }
  }),
});
