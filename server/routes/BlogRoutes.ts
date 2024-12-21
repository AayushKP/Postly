import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: "You aren't logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("userId");
    const body = await c.req.json();
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server error" }, 500);
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const posts = await prisma.post.findMany({});
    return c.json(posts);
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server error" }, 500);
  }
});

blogRouter.get("/get/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const id = c.req.param("id");
    const post = await prisma.post.findUnique({
      where: { id },
    });

    return c.json(post);
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    await prisma.post.update({
      where: {
        id: body.id,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.text("updated post");
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" });
  }
});

export default blogRouter;
