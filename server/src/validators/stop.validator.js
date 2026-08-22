import { z } from "zod";

export const createStopSchema = z.object({
  cityName: z.string().min(1, { message: "cityName is required" }),
  country: z.string().optional().nullable(),
  startDate: z.string().datetime({ message: "startDate must be a valid ISO datetime" }),
  endDate: z.string().datetime({ message: "endDate must be a valid ISO datetime" }),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  costIndex: z.number().optional().nullable(),
  popularity: z.number().int().optional().nullable(),
});

export const updateStopSchema = z.object({
  cityName: z.string().min(1).optional(),
  country: z.string().optional().nullable(),
  startDate: z.string().datetime({ message: "startDate must be a valid ISO datetime" }).optional(),
  endDate: z.string().datetime({ message: "endDate must be a valid ISO datetime" }).optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  costIndex: z.number().optional().nullable(),
  popularity: z.number().int().optional().nullable(),
  order: z.number().int().optional(),
});

export const reorderStopsSchema = z.object({
  stopIds: z.array(z.string().uuid({ message: "Each stopId must be a valid UUID" })).min(1, { message: "stopIds array is required" }),
});
