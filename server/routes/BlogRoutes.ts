import { Hono } from "hono";
import { verify } from "hono/jwt";
import * as blogController from "../controllers/blogController";
import { authMiddleware } from "../middleware/authMiddleware";

// Define custom bindings for environment variables
interface Bindings {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

// Define custom context with the userId stored in context
interface Variables {
  userId: string;
}

// Create the blog router with proper types
export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// Middleware to check JWT authorization
blogRouter.use("/*", authMiddleware);

// Define routes with controller functions
blogRouter.post("/", blogController.createBlog);
blogRouter.put("/", blogController.updateBlog);
blogRouter.get("/bulk", blogController.getAllBlogs);
blogRouter.get("/:id", blogController.getBlogById);
