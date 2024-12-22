import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Hono } from "hono";
import { signinInput, signupInput } from "@kashyaap-tech/medium-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// Signup Route
userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid inputs" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // Hash password in production
      },
    });

    // Generate a JWT
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt }, 201);
  } catch (error) {
    console.error("Signup Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Signin Route
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "Invalid input" });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || user.password !== body.password) {
      // Use secure password comparison in production
      return c.json({ error: "Invalid email or password" }, 403);
    }

    // Generate a JWT
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (error) {
    console.error("Signin Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default userRouter;
