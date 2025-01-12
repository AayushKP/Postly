import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@kashyaap-tech/medium-common";

// Controller for handling user signup
export const signup = async (c: any) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    // Send JWT as an HTTP-only, Secure cookie
    return c.json({ message: "Signup successful", user, token: jwt });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Error during signup");
  } finally {
    await prisma.$disconnect();
  }
};

// Controller for handling user signin
export const signin = async (c: any) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    return c.json(
      {
        message: "Please enter a valid username and password",
      },
      400
    );
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect credentials",
      });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    // Send JWT as an HTTP-only, Secure cookie
    return c.json({ message: "Signin successful", user, token: jwt });
  } catch (e) {
    console.log(e);
    c.status(400);
    return c.text("Error during signin");
  }
};

export const getUserInfo = async (c: any) => {
  console.log(c.req.userId);
  const userId = c.req.userId;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, name: true },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "User not found",
      });
    }

    return c.json(user);
  } catch (e) {
    console.log(e);
    c.status(400);
    return c.json({
      message: "Error fetching user info",
    });
  } finally {
    await prisma.$disconnect();
  }
};


