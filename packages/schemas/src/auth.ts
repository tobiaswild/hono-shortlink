import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(72, 'Password must be at most 72 characters long')
  .regex(/[a-z]/, 'Must include at least one lowercase letter')
  .regex(/[A-Z]/, 'Must include at least one uppercase letter')
  .regex(/[0-9]/, 'Must include at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character');

export const loginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
