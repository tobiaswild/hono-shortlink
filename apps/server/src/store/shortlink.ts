import type { User } from "better-auth";
import { and, eq } from "drizzle-orm";
import { NotFoundError } from "../errors/not-found-error";
import { shortlink } from "../schema/shortlink";
import { db } from "../utils/db";

export const ShortlinkStore = {
  async getAllForUser(user: User) {
    return db
      .select()
      .from(shortlink)
      .where(eq(shortlink.userId, user.id))
      .all();
  },
  async createForUser(user: User, code: string, url: string) {
    const [link] = await db
      .insert(shortlink)
      .values({
        userId: user.id,
        code: code,
        url: url,
      })
      .returning();

    if (!link) {
      throw new Error("Failed to create shortlink");
    }

    return link;
  },
  async getForUser(user: User, code: string) {
    return await db
      .select()
      .from(shortlink)
      .where(and(eq(shortlink.userId, user.id), eq(shortlink.code, code)))
      .get();
  },
  async updateForUser(user: User, code: string, url: string) {
    const [link] = await db
      .update(shortlink)
      .set({ url, updatedAt: new Date() })
      .where(and(eq(shortlink.userId, user.id), eq(shortlink.code, code)))
      .returning();

    if (!link) {
      throw new NotFoundError("Shortlink");
    }

    return link;
  },
  async deleteForUser(user: User, code: string) {
    const [link] = await db
      .delete(shortlink)
      .where(and(eq(shortlink.userId, user.id), eq(shortlink.code, code)))
      .returning();

    if (!link) {
      throw new NotFoundError("Shortlink");
    }

    return link;
  },
  async get(code: string) {
    return await db
      .select()
      .from(shortlink)
      .where(eq(shortlink.code, code))
      .get();
  },
};
