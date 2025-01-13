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
export const getPopularBlogs = async (c: any) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const popularBlogs = await prisma.blog.findMany({
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

    const blogsWithBookmarkCounts = await Promise.all(
      popularBlogs.map(async (blog) => {
        const bookmarkCount = await prisma.bookmark.count({
          where: {
            blogId: blog.id,
          },
        });

        return {
          ...blog,
          bookmarkCount,
        };
      })
    );

    // Sort blogs by bookmark count in descending order
    const sortedBlogs = blogsWithBookmarkCounts.sort(
      (a, b) => b.bookmarkCount - a.bookmarkCount
    );

    const topBlogs = sortedBlogs.slice(0, 3);

    return c.json({
      popularBlogs: topBlogs,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error fetching popular blogs",
    });
  } finally {
    await prisma.$disconnect();
  }
};

// Controller for bookmarking/unbookmarking a blog post
export const bookmarkBlog = async (c: any) => {
  const { blogId } = await c.req.json(); // Assume blogId is provided in the request body
  const userId = c.req.userId; // User ID from request context
  
  // Initialize Prisma Client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
  }).$extends(withAccelerate());

  try {
    // Check if the blog is already bookmarked by the user
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });

    if (existingBookmark) {
      // If already bookmarked, remove the bookmark
      await prisma.bookmark.delete({
        where: {
          userId_blogId: {
            // Use the composite key
            userId: existingBookmark.userId,
            blogId: existingBookmark.blogId,
          },
        },
      });
      return c.json({
        message: "Blog removed from bookmarks",
      });
    } else {
      // If not bookmarked, add the bookmark
      await prisma.bookmark.create({
        data: {
          userId: userId,
          blogId: blogId,
        },
      });
      return c.json({
        message: "Blog bookmarked successfully",
      });
    }
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error handling bookmark",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
};

// Controller for fetching a user's bookmarked blogs
export const getBookmarkedBlogs = async (c: any) => {
  const userId = c.req.userId; // Get userId from request context

  // Initialize Prisma Client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // Access environment variable for DB URL
  }).$extends(withAccelerate());

  try {
    // Find all blogs bookmarked by the user
    const bookmarkedBlogs = await prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
      include: {
        blog: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            createdAt: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!bookmarkedBlogs.length) {
      return c.json({
        message: "No bookmarked blogs found",
      });
    }

    // Map through the bookmarked blogs and return the blog data
    const blogs = bookmarkedBlogs.map((bookmark) => bookmark.blog);

    return c.json({
      bookmarkedBlogs: blogs,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error fetching bookmarked blogs",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
};

