import { z } from "zod";

// SECURITY: Validate that URL fields only accept http/https to prevent XSS via javascript: URIs.
const safeUrlOrNull = z
  .string()
  .url({ message: "must be a valid URL" })
  .refine((u) => u.startsWith("http://") || u.startsWith("https://"), {
    message: "URL must use http or https",
  })
  .nullable()
  .optional();

export const createTripSchema = z.object({
  name: z.string().min(1, { message: "name is required" }).max(256),
  startDate: z.string().datetime({ message: "startDate must be a valid ISO datetime string" }),
  endDate: z.string().datetime({ message: "endDate must be a valid ISO datetime string" }),
  description: z.string().max(2000).nullable().optional(),
  coverPhoto: safeUrlOrNull,
  budgetLimit: z.number().nonnegative().nullable().optional(),
});

export const updateTripSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  startDate: z.string().datetime({ message: "startDate must be a valid ISO datetime string" }).optional(),
  endDate: z.string().datetime({ message: "endDate must be a valid ISO datetime string" }).optional(),
  description: z.string().max(2000).nullable().optional(),
  coverPhoto: safeUrlOrNull,
  isPublic: z.boolean().optional(),
  budgetLimit: z.number().nonnegative().nullable().optional(),
});
