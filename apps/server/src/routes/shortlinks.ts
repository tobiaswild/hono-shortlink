import { zValidator } from '@hono/zod-validator';
import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from '@repo/types';
import { Hono } from 'hono';
import type { Shortlink } from 'src/db/types/shortlink.js';
import z from 'zod';
import shortlinkStore from '../db/store/shortlink.js';
import { authMiddleware } from '../middleware/auth.js';
import { getCode } from '../util/code.js';

const app = new Hono();

const shortlinkParamSchema = z.object({
  code: z.string().min(6),
});

export type ShortlinksResponse = ApiResponse & {
  shortlinks: Shortlink[];
};

app.get('/', authMiddleware, async (c) => {
  const user = c.get('user');

  const shortlinks = await shortlinkStore.getAllForUser(user);

  return c.json<ShortlinksResponse>({
    success: true,
    shortlinks,
  });
});

const createShortlinkSchema = z.object({
  url: z.url(),
  customCode: z.string().min(6).max(6).optional(),
});

app.post(
  '/',
  authMiddleware,
  zValidator('json', createShortlinkSchema),
  async (c): Promise<Response> => {
    const user = c.get('user');

    const validated = c.req.valid('json');
    const url = validated.url;
    const customCode = validated.customCode;

    if (!url) {
      return c.json<ApiErrorResponse>({
        success: false,
        type: 'error',
        message: 'URL is required',
      });
    }

    let code = customCode;

    if (!customCode) {
      try {
        code = await getCode();
      } catch (err) {
        console.error(err);

        return c.json<ApiErrorResponse>({
          success: false,
          type: 'error',
          message: 'Failed to create shortlink code',
        });
      }
    }

    if (!code) {
      return c.json<ApiErrorResponse>({
        success: false,
        type: 'error',
        message: 'No code given',
      });
    }

    try {
      await shortlinkStore.createForUser(user, code, url);
    } catch (err) {
      console.error(err);

      return c.json<ApiErrorResponse>({
        success: false,
        type: 'error',
        message: 'an error occured',
      });
    }

    return c.json<ApiSuccessResponse>({
      success: true,
      type: 'success',
      message: 'Shortlink created',
    });
  },
);

type ShortlinkResponse = ApiResponse & {
  success: true;
  shortlink: Shortlink;
};

app.get(
  '/:code',
  zValidator('param', shortlinkParamSchema),
  authMiddleware,
  async (c) => {
    const validated = c.req.valid('param');
    const code = validated.code;

    const user = c.get('user');

    const shortlink = await shortlinkStore.getForUser(user, code);

    return c.json<ShortlinkResponse>({
      success: true,
      shortlink,
    });
  },
);

const shortlinkPatchSchema = z.object({
  url: z.url(),
});

app.patch(
  '/:code',
  zValidator('param', shortlinkParamSchema),
  zValidator('json', shortlinkPatchSchema),
  authMiddleware,
  async (c) => {
    const code = c.req.valid('param').code;

    const url = c.req.valid('json').url;

    const user = c.get('user');

    await shortlinkStore.updateForUser(user, code, url);

    return c.json<ApiSuccessResponse>({
      success: true,
      type: 'success',
      message: 'shortlink updated',
    });
  },
);

app.delete(
  '/:code',
  zValidator('param', shortlinkParamSchema),
  authMiddleware,
  async (c) => {
    const user = c.get('user');

    const validated = c.req.valid('param');
    const code = validated.code;

    const deleted = await shortlinkStore.deleteForUser(user, code);
    if (!deleted) {
      return c.json<ApiErrorResponse>({
        success: false,
        type: 'error',
        message: 'Failed to delete shortlink',
      });
    }

    return c.json<ApiSuccessResponse>({
      success: true,
      type: 'success',
      message: 'Shortlink deleted',
    });
  },
);

export default app;
