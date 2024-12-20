import { Hono } from "hono";

const blogRouter = new Hono();

blogRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text(`Blog-Id is: ${id}`);
});

blogRouter.get("/", (c) => {
  console.log(c.get("userId"));
  return c.text("Blog Route");
});

/*
blogRouter.get("/bulk", async (c) => {
  // Retrieve a comma-separated list of blog post IDs from query params
  const ids = c.req.query("ids");

  if (!ids) {
    return c.json({ error: "No IDs provided" }, 400);
  }

  const idArray = ids.split(","); // Convert to an array of IDs

  // Assuming you're querying a database (replace with actual database logic)
  try {
    const blogPosts = await db.blogPosts.findMany({
      where: {
        id: { in: idArray }, // Fetch posts where the ID is in the provided array
      },
    });

    if (blogPosts.length === 0) {
      return c.json({ message: "No blog posts found for the given IDs" }, 404);
    }

    return c.json(blogPosts); // Return the fetched blog posts
  } catch (error) {
    return c.json({ error: "Failed to fetch blog posts" }, 500);
  }
}); */

export default blogRouter;
