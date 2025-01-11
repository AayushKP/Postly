import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@kashyaap-tech/medium-common";

// Controller for creating a blog post
export const createBlog = async (c: any) => {
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const authorId = c.get("userId"); // Get userId from context

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable from c.env
  }).$extends(withAccelerate());

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorId),
    },
  });

  return c.json({
    id: blog.id,
  });
};

// Controller for updating a blog post
export const updateBlog = async (c: any) => {
  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable from c.env
  }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
};

// Controller for fetching all blog posts
export const getAllBlogs = async (c: any) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable from c.env
  }).$extends(withAccelerate());

  const blogs = await prisma.blog.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return c.json({
    blogs,
  });
};

// Controller for fetching a single blog post by ID
export const getBlogById = async (c: any) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable from c.env
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
};
