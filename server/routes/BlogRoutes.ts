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
blogRouter.put("/:id", blogController.updateBlog); // Route to update a blog post by ID
blogRouter.get("/bulk", blogController.getAllBlogs); // Route to fetch all blog posts
blogRouter.get("/:id", blogController.getBlogById); // Route to fetch a single blog post by ID
blogRouter.get("/popularBlogs", blogController.getPopularBlogs); // Route to bookmark/unbookmark a blog post
blogRouter.post("/bookmark", blogController.bookmarkBlog); // Route to bookmark/unbookmark a blog post
blogRouter.get("/bookmarks", blogController.getBookmarkedBlogs); // Route to fetch bookmarked blogs for the user
