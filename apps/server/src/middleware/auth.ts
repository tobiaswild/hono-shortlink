import type { Session, User } from "better-auth";
import { createMiddleware } from "hono/factory";
import { auth } from "../utils/auth";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const authMiddleware = createMiddleware<{
  Variables: {
    user: User;
    session: Session;
  };
}>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (session === null) {
    throw new UnauthorizedError();
  }

  c.set("user", session.user);
  c.set("session", session.session);

  return next();
});
