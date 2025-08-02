import { serve } from "@hono/node-server";
import { Hono } from "hono";
import todos from "@/routes/todos";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.basePath("/api").route("/todos", todos);
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export default app;
