import z from 'zod';

export const shortlinkCodeSchema = z.string().min(6).max(6);

export const shortlinkUrlSchema = z.url();

export const createShortlinkSchema = z.object({
  url: shortlinkUrlSchema,
  code: shortlinkCodeSchema,
});

export type CreateShortlinkSchema = z.infer<typeof createShortlinkSchema>;

export const patchShortlinkSchema = z.object({
  url: shortlinkUrlSchema,
});

export const paramShortlinkSchema = z.object({
  code: shortlinkCodeSchema,
});

export type DeleteShortlinkSchema = z.infer<typeof paramShortlinkSchema>;
