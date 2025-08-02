import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "../lib/zod-validator.js";
import { prisma } from "../lib/prisma.js";

const app = new Hono();

const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  completed: z.boolean().optional(),
});

app.get("/", async (c) => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json(todos);
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }
  return c.json(todo);
});

app.post("/", zValidator("json", createTodoSchema), async (c) => {
  const data = c.req.valid("json");
  const newTodo = await prisma.todo.create({
    data: {
      title: data.title,
    },
  });
  return c.json(newTodo, 201);
});

app.put("/:id", zValidator("json", updateTodoSchema), async (c) => {
  const { id } = c.req.param();
  const data = c.req.valid("json");

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: data,
  });

  return c.json(updatedTodo);
});

app.delete("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    await prisma.todo.delete({
      where: { id },
    });
    return c.json({ message: "Todo deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ message: "Todo not found" }, 404);
    }
    throw error;
  }
});

export default app;
