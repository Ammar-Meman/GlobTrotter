import { z } from "zod";

export const createTripSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  startDate: z.string().datetime({ message: "startDate must be a valid ISO datetime string" }),
  endDate: z.string().datetime({ message: "endDate must be a valid ISO datetime string" }),
  description: z.string().nullable().optional(),
  coverPhoto: z.string().nullable().optional(),
  budgetLimit: z.number().nullable().optional(),
});

export const updateTripSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.string().datetime({ message: "startDate must be a valid ISO datetime string" }).optional(),
  endDate: z.string().datetime({ message: "endDate must be a valid ISO datetime string" }).optional(),
  description: z.string().nullable().optional(),
  coverPhoto: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
  budgetLimit: z.number().nullable().optional(),
});
