import { Hono } from "hono";
import { userRouter } from "../routes/UserRoutes";
import { blogRouter } from "../routes/BlogRoutes";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use(
  "*",
  cors({
    origin: "https://postly-delta.vercel.app",
    credentials: true,
  })
);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
