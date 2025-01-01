import { Hono } from "hono";
import { userRouter } from "../routes/UserRoutes";
import { blogRouter } from "../routes/BlogRoutes";
import { cors } from "hono/cors";
import { aiRouter } from "../routes/aiRoutes";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use("*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/suggest", aiRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
