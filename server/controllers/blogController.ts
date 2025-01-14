import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@kashyaap-tech/medium-common";

export const createBlog = async (c: any) => {
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }
  const authorId = c.req.userId; 
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, 
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

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, 
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        image: body.image || undefined,
        published: body.published !== undefined ? body.published : undefined,
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
    await prisma.$disconnect(); 
  }
};

export const getAllBlogs = async (c: any) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, 
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
    await prisma.$disconnect();
  }
};

export const getBlogById = async (c: any) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
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
        author: true,
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
    await prisma.$disconnect();
  }
};

export const getPopularBlogs = async (c: any) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    console.log("Fetching popular blogs...");
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
    console.log("Fetched popular blogs:", popularBlogs);

    const blogsWithBookmarkCounts = await Promise.all(
      popularBlogs.map(async (blog) => {
        console.log("Fetching bookmark count for blog:", blog.id);
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
    const sortedBlogs = blogsWithBookmarkCounts.sort(
      (a, b) => b.bookmarkCount - a.bookmarkCount
    );

    const isSameBookmarkCount = sortedBlogs.every(
      (blog, _, arr) => blog.bookmarkCount === arr[0].bookmarkCount
    );

    const topBlogs = isSameBookmarkCount
      ? sortedBlogs.slice(-3)
      : sortedBlogs.slice(0, 3);

    return c.json({
      popularBlogs: topBlogs,
    });
  } catch (error: any) {
    console.error("Error during popular blogs fetch:", error);
    console.error(error.stack);
    return c.json({
      message: `Error fetching popular blogs: ${error.message || error}`,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getBookmarkedBlogs = async (c: any) => {
  const userId = c.req.userId;

  // Initialize Prisma Client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
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
    await prisma.$disconnect();
  }
};

export const getAuthorBlogs = async (c: any) => {
  const { authorId } = c.req.query();

  const parsedAuthorId = Number(authorId);

  if (isNaN(parsedAuthorId)) {
    return c.json({
      message: "Invalid authorId",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const authorBlogs = await prisma.blog.findMany({
      where: {
        authorId: parsedAuthorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 2, // Limit to 2 posts
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
    });

    if (authorBlogs.length === 0) {
      return c.json({
        message: "No more posts available from this author",
      });
    }

    return c.json({
      blogs: authorBlogs,
    });
  } catch (error) {
    console.error("Error fetching author's blogs:", error);
    c.status(500);
    return c.json({
      message: "Error fetching author's blogs",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const bookmarkBlog = async (c: any) => {
  const { blogId } = await c.req.json();
  const userId = c.req.userId;

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        blogId,
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });

      return c.json({
        message: "Blog removed from bookmarks",
      });
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          blogId,
        },
      });

      return c.json({
        message: "Blog bookmarked successfully",
      });
    }
  } catch (error) {
    console.error("Error handling bookmark:", error);

    c.status(500);
    return c.json({
      message: "Error handling bookmark operation",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteBlog = async (c: any) => {
  const id = c.req.param("id");

  // Initialize Prisma Client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.blog.delete({
      where: {
        id: Number(id),
      },
    });

    return c.json({
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      c.status(404);
      return c.json({
        message: "Blog not found",
      });
    }

    c.status(500);
    return c.json({
      message: "Error deleting blog post",
    });
  } finally {
    await prisma.$disconnect();
  }
};
