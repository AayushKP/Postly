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
  const userId = c.req.userId;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            published: true,
          },
        },
        bookmarkedBlogs: {
          select: {
            blog: {
              select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "User not found",
      });
    }

    // If `bio` is missing, it will naturally be `null`
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



// Controller to update user info (name, bio, and password)
export const updateUser = async (c: any) => {
  const userId = c.req.userId; // Ensure userId is passed or authenticated through JWT
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { name, bio, password } = body; // Get new values for name, bio, and password

  // Prepare data for update
  const updatedData: any = {};

  // If `name` is provided, update it
  if (name) {
    updatedData.name = name;
  }

  // If `bio` is provided (could be null), update it
  if (bio !== undefined) {
    updatedData.bio = bio;
  }

  // If `password` is provided, update it (but only if it's not null)
  if (password !== undefined && password !== null) {
    updatedData.password = password;
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "User not found",
      });
    }

    // Update user in the database with the provided data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return c.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.log(e);
    c.status(400);
    return c.json({
      message: "Error updating user info",
    });
  } finally {
    await prisma.$disconnect();
  }
};
