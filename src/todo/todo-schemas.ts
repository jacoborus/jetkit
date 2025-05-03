import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import todoRepo from "./todo-repo";

export const selectTodoSchema = createSelectSchema(todoRepo, {
  title: (schema) => schema.trim(),
  description: (schema) => schema.trim(),
});

export type Todo = z.infer<typeof todo>;
export const todo = selectTodoSchema;

const todoSchema = createInsertSchema(todoRepo, {
  title: (schema) => schema.trim().min(1),
  description: (schema) => schema.trim().optional(),
});

export type TodoCreateInput = z.infer<typeof todoCreateInput>;
export const todoCreateInput = todoSchema.pick({
  title: true,
  description: true,
  author: true,
});

export type TodoCreateRequest = z.infer<typeof todoCreateRequest>;
export const todoCreateRequest = todoSchema.pick({
  title: true,
  description: true,
});

export type OwnTodo = z.infer<typeof ownTodo>;
export const ownTodo = selectTodoSchema.pick({
  title: true,
  description: true,
  id: true,
});
