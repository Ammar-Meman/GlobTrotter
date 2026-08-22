import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(128).optional(),
  // SECURITY: Restrict photoUrl to valid http/https URLs only — prevents
  // javascript: URIs and data: URIs being stored and reflected as XSS vectors.
  photoUrl: z
    .string()
    .url({ message: "photoUrl must be a valid URL" })
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      { message: "photoUrl must use http or https" }
    )
    .nullable()
    .optional(),
  language: z.string().max(10).optional(),
});

export const createSavedDestinationSchema = z.object({
  cityName: z.string().min(1, { message: "cityName is required" }),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required to delete account" }),
});
