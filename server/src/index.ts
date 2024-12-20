import { Hono } from "hono";
import userRouter from "../routes/userRoutes.js";
import blogRouter from "../routes/blogRoutes.js";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.use("/api/v1/blog/*", async (c, next) => {
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
