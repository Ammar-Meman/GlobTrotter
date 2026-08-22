import { z } from "zod";

export const citySearchSchema = z.object({
  q: z.string().optional().default(""),
});

export const activitySearchSchema = z.object({
  city: z.string().optional(),
  type: z.string().optional(),
  maxCost: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined)),
});
