import { z } from "zod";

export const activityCategoryEnum = z.enum(["transport", "stay", "activity", "meal"], {
  errorMap: () => ({ message: "category must be one of: transport, stay, activity, meal" }),
});

export const createActivitySchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  type: z.string().min(1, { message: "type is required" }),
  category: activityCategoryEnum,
  cost: z.number().min(0, { message: "cost must be a non-negative number" }),
  duration: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export const updateActivitySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  category: activityCategoryEnum.optional(),
  cost: z.number().min(0, { message: "cost must be a non-negative number" }).optional(),
  duration: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

export const reorderActivitiesSchema = z.object({
  activityIds: z
    .array(z.string().uuid({ message: "Each activityId must be a valid UUID" }))
    .min(1, { message: "activityIds array is required" }),
});
