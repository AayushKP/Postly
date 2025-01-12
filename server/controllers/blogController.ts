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

  const authorId = c.req.userId; // Assume userId is available from request context

  // Initialize Prisma Client inside the controller function
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
        image: body.image || null, // Optional image URL
        published: body.published || false, // Optional published status
      },
    });

    return c.json({
      id: blog.id,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error creating blog post",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after request is done
  }
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

  // Initialize Prisma Client inside the controller function
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        image: body.image || undefined, // Optional image field
        published: body.published !== undefined ? body.published : undefined, // Optional published field
      },
    });

    return c.json({
      id: blog.id,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error updating blog post",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after request is done
  }
};

// Controller for fetching all blog posts
export const getAllBlogs = async (c: any) => {
  // Initialize Prisma Client inside the controller function
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        createdAt: true,
        image: true,
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
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error fetching blogs",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after request is done
  }
};

// Controller for fetching a single blog post by ID
export const getBlogById = async (c: any) => {
  const id = c.req.param("id");

  // Initialize Prisma Client inside the controller function
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
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
        createdAt: true,
        image: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({
        message: "Blog not found",
      });
    }

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(500);
    return c.json({
      message: "Error while fetching blog post",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after request is done
  }
};

// Controller for bookmarking a blog
export const bookmarkBlog = async (c: any) => {
  const { blogId } = await c.req.json(); // Expect blogId in the request body
  const userId = c.req.userId; // Assume userId is available in the request context

  // Initialize Prisma Client inside the controller function
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
  }).$extends(withAccelerate());

  try {
    // Check if the blog is already bookmarked
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        blogId: Number(blogId),
        userId: Number(userId),
      },
    });

    if (existingBookmark) {
      // If already bookmarked, remove it
      await prisma.bookmark.delete({
        where: {
          userId_blogId: {
            userId: Number(userId),
            blogId: Number(blogId),
          },
        },
      });

      return c.json({
        message: "Bookmark removed",
      });
    } else {
      // Otherwise, add a new bookmark
      await prisma.bookmark.create({
        data: {
          userId: Number(userId),
          blogId: Number(blogId),
        },
      });

      return c.json({
        message: "Blog bookmarked",
      });
    }
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error bookmarking the blog",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after request is done
  }
};
