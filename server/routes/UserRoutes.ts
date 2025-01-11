import { Hono } from "hono";
import { signup, signin, getUserInfo } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

// Create the user router
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", signup);

userRouter.post("/signin", signin);

userRouter.get("/user-info", authMiddleware, getUserInfo);

export default userRouter;
