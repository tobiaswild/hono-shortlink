import type { Context, ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { ForbiddenError } from '../errors/forbidden-error';
import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { ValidationError } from '../errors/validation-error';

export interface ErrorResponse {
  error: string;
  message: string;
  details?: unknown;
  timestamp: string;
  path: string;
  method: string;
}

const createErrorResponse = (
  c: Context,
  error: string,
  message: string,
  details?: unknown,
): ErrorResponse => {
  return {
    error,
    message,
    details,
    timestamp: new Date().toISOString(),
    path: c.req.path,
    method: c.req.method,
  };
};

export const globalErrorHandler: ErrorHandler = (err, c) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    console.error('Error:', err);
  }

  if (err instanceof UnauthorizedError || err.name === 'UnauthorizedError') {
    const response = createErrorResponse(
      c,
      'Unauthorized',
      err.message || 'Authentication required',
    );
    return c.json(response, 401);
  }

  if (err instanceof ForbiddenError || err.name === 'ForbiddenError') {
    const response = createErrorResponse(
      c,
      'Forbidden',
      err.message || 'Access denied',
    );
    return c.json(response, 403);
  }

  if (err instanceof NotFoundError || err.name === 'NotFoundError') {
    const response = createErrorResponse(c, 'Not Found', err.message);
    return c.json(response, 404);
  }

  if (err instanceof ValidationError || err.name === 'ValidationError') {
    const details =
      isDevelopment && (err as ValidationError).field
        ? { field: (err as ValidationError).field }
        : undefined;

    const response = createErrorResponse(
      c,
      'Validation Error',
      err.message,
      details,
    );
    return c.json(response, 400);
  }

  if (err instanceof ZodError || err.name === 'ZodError') {
    const details = isDevelopment ? (err as ZodError).issues : undefined;
    const response = createErrorResponse(
      c,
      'Validation Error',
      'Invalid input data',
      details,
    );
    return c.json(response, 400);
  }

  if (err instanceof HTTPException) {
    const response = createErrorResponse(
      c,
      err.message || 'HTTP Error',
      err.message,
    );
    return c.json(response, err.status);
  }

  if (err instanceof Error) {
    if (err.message.includes('UNIQUE constraint failed')) {
      const response = createErrorResponse(
        c,
        'Duplicate Entry',
        'A record with this value already exists',
      );
      return c.json(response, 409);
    }

    if (err.message.includes('FOREIGN KEY constraint failed')) {
      const response = createErrorResponse(
        c,
        'Invalid Reference',
        'Referenced record does not exist',
      );
      return c.json(response, 400);
    }

    if (
      err.message.includes('ECONNREFUSED') ||
      err.message.includes('ENOTFOUND')
    ) {
      const response = createErrorResponse(
        c,
        'Service Unavailable',
        'Unable to connect to external service',
      );
      return c.json(response, 503);
    }
  }

  const message = isDevelopment ? err.message : 'Something went wrong';
  const details = isDevelopment && err.stack ? { stack: err.stack } : undefined;

  const response = createErrorResponse(
    c,
    'Internal Server Error',
    message,
    details,
  );
  return c.json(response, 500);
};
