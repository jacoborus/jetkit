import { eq, and } from "drizzle-orm";
import db from "@/db/db";
import todoRepo from "./todo-repo";
import * as schemas from "./todo-schemas";

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function list(userId: string, options?: ListOptions) {
  return await db.query.todo.findMany({
    columns: { author: false },
    where: (todos, { eq }) => eq(todos.author, userId),
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function getById(id: string, userId: string) {
  return await db.query.todo.findFirst({
    where: (todo, { eq, and }) => and(eq(todo.id, id), eq(todo.author, userId)),
  });
}

export async function create(payload: schemas.TodoCreateInput) {
  const todos = await db.insert(todoRepo).values(payload).returning();
  const todo = schemas.todo.parse(todos[0]);
  return { id: todo.id, title: todo.title, description: todo.description };
}

export async function remove(id: string, userId: string) {
  await db
    .delete(todoRepo)
    .where(and(eq(todoRepo.id, id), eq(todoRepo.author, userId)));
}
