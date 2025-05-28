import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

app.get("/", (c) => {
  return c.text("Many posts");
});

app.post("/", (c) => {
  return c.json(
    {
      message: "Created",
    },
    201,
    {
      "X-Custom": "Thank you",
    },
  );
});

export default app;
