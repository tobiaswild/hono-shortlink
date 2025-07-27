import { zValidator } from "@hono/zod-validator";
import {
  createShortlinkSchema,
  paramShortlinkSchema,
  patchShortlinkSchema,
} from "@repo/schemas";
import type { ApiResponse } from "@repo/types";
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { NotFoundError } from "../errors/not-found-error";
import type { Shortlink } from "../schema/shortlink";
import { ShortlinkStore } from "../store/shortlink";

const app = new Hono();

app.get("/", authMiddleware, async (c) => {
  const user = c.get("user");

  const shortlinks = await ShortlinkStore.getAllForUser(user);

  return c.json<ApiResponse<Shortlink[]>>({
    success: true,
    data: shortlinks,
  });
});

app.post(
  "/",
  authMiddleware,
  zValidator("json", createShortlinkSchema),
  async (c) => {
    const user = c.get("user");
    const validated = c.req.valid("json");
    const url = validated.url;
    const code = validated.code;

    const data = await ShortlinkStore.createForUser(user, code, url);

    return c.json<ApiResponse<Shortlink>>({
      success: true,
      data,
    });
  },
);

app.get(
  "/:code",
  zValidator("param", paramShortlinkSchema),
  authMiddleware,
  async (c) => {
    const validated = c.req.valid("param");
    const code = validated.code;

    const user = c.get("user");

    const shortlink = await ShortlinkStore.getForUser(user, code);

    if (!shortlink) {
      throw new NotFoundError("Shortlink");
    }

    return c.json<ApiResponse<Shortlink>>({
      success: true,
      data: shortlink,
    });
  },
);

app.patch(
  "/:code",
  zValidator("param", paramShortlinkSchema),
  zValidator("json", patchShortlinkSchema),
  authMiddleware,
  async (c) => {
    const param = c.req.valid("param");
    const code = param.code;

    const json = c.req.valid("json");
    const url = json.url;

    const user = c.get("user");

    const data = await ShortlinkStore.updateForUser(user, code, url);

    return c.json<ApiResponse<Shortlink>>({
      success: true,
      data,
    });
  },
);

app.delete(
  "/:code",
  zValidator("param", paramShortlinkSchema),
  authMiddleware,
  async (c) => {
    const param = c.req.valid("param");
    const code = param.code;

    const user = c.get("user");

    const deleted = await ShortlinkStore.deleteForUser(user, code);

    return c.json<ApiResponse<Shortlink>>({
      success: true,
      data: deleted,
    });
  },
);

export default app;
