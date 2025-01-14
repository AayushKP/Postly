import { Hono } from "hono";
import * as blogController from "../controllers/blogController";
import { authMiddleware } from "../middleware/authMiddleware";

// Define custom bindings for environment variables
interface Bindings {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

interface Variables {
  userId: string;
}

// Create the blog router with proper types
export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// Middleware to check JWT authorization for all routes
blogRouter.use("/*", authMiddleware);

// Define routes with controller functions
blogRouter.post("/", blogController.createBlog); // Route to create a blog post
blogRouter.delete("/delete/:id", blogController.deleteBlog); // Route to fetch bookmarked blogs for the user
blogRouter.get("/bulk", blogController.getAllBlogs); // Route to fetch all blog posts
blogRouter.get("/:id", blogController.getBlogById); // Route to fetch a single blog post by ID
blogRouter.get("/blogs/popular", blogController.getPopularBlogs); // Route to bookmark/unbookmark a blog post
blogRouter.post("/blogs/bookmark", blogController.bookmarkBlog); // Route to bookmark/unbookmark a blog post
blogRouter.get("/blogs/bookmarks", blogController.getBookmarkedBlogs); // Route to fetch bookmarked blogs for the user
blogRouter.get('/blogs/author', blogController.getAuthorBlogs);  // Endpoint for fetching author's blogs

