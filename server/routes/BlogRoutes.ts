import { Hono } from "hono";
import * as blogController from "../controllers/blogController";
import { authMiddleware } from "../middleware/authMiddleware";

interface Bindings {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

interface Variables {
  userId: string;
}

export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

blogRouter.use("/*", authMiddleware);

blogRouter.post("/", blogController.createBlog);
blogRouter.delete("/delete/:id", blogController.deleteBlog);
blogRouter.get("/bulk", blogController.getAllBlogs);
blogRouter.get("/:id", blogController.getBlogById);
blogRouter.get("/blogs/popular", blogController.getPopularBlogs);
blogRouter.post("/blogs/bookmark", blogController.bookmarkBlog);
blogRouter.get("/blogs/bookmarks", blogController.getBookmarkedBlogs);
blogRouter.get("/blogs/author", blogController.getAuthorBlogs);  

