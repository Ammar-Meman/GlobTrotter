import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  photoUrl: z.string().nullable().optional(),
  language: z.string().optional(),
});

export const createSavedDestinationSchema = z.object({
  cityName: z.string().min(1, { message: "cityName is required" }),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required to delete account" }),
});
