import { z } from "zod";

// SECURITY: Only allow http/https URLs for image fields.
const safeUrlOrNull = z
  .string()
  .url({ message: "imageUrl must be a valid URL" })
  .refine((u) => u.startsWith("http://") || u.startsWith("https://"), {
    message: "imageUrl must use http or https",
  })
  .nullable()
  .optional();

export const activityCategoryEnum = z.enum(["transport", "stay", "activity", "meal"], {
  errorMap: () => ({ message: "category must be one of: transport, stay, activity, meal" }),
});

export const createActivitySchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  type: z.string().min(1, { message: "type is required" }),
  category: activityCategoryEnum,
  cost: z.number().min(0, { message: "cost must be a non-negative number" }),
  scheduledAt: z.string().datetime({ message: "scheduledAt must be a valid ISO datetime" }),
  duration: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: safeUrlOrNull,
});

export const updateActivitySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  category: activityCategoryEnum.optional(),
  cost: z.number().min(0, { message: "cost must be a non-negative number" }).optional(),
  scheduledAt: z.string().datetime({ message: "scheduledAt must be a valid ISO datetime" }).optional(),
  duration: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: safeUrlOrNull,
  order: z.number().int().optional(),
});

export const reorderActivitiesSchema = z.object({
  date: z.string().min(1, { message: "date is required" }),
  activityIds: z
    .array(z.string().uuid({ message: "Each activityId must be a valid UUID" }))
    .min(1, { message: "activityIds array is required" }),
});
