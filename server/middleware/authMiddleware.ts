import { verify } from "hono/jwt";

export const authMiddleware = async (c: any, next: () => void) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    // Verifying JWT using the secret from environment variables
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
};
