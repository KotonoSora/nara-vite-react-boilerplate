import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

export default app;
