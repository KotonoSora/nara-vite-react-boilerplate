import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

app.get("/", (c) => c.text("List Books")); // GET /book

app.get("/:id", (c) => {
  // GET /book/:id
  const id = c.req.param("id");
  return c.text("Get Book: " + id);
});

app.post("/", (c) => c.text("Create Book")); // POST /book

export default app;
