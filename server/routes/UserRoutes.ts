import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

// Create the Hono router
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// Signup Route
userRouter.post("/signup", async (c) => {
  // Initialize PrismaClient with Accelerate for each request
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    // Validate the input
    if (!body.email || !body.password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // Hash the password in production
      },
    });

    // Generate a JWT
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt }, 201); // Return JWT with created status
  } catch (error) {
    console.error("Signup Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  } finally {
    await prisma.$disconnect(); // Clean up Prisma connection
  }
});

// Signin Route
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    // Validate the input
    if (!body.email || !body.password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || user.password !== body.password) {
      // Use secure password comparison in production
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Generate a JWT
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (error) {
    console.error("Signin Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

export default userRouter;
