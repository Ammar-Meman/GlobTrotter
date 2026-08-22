import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  email: z.string().email({ message: "email is invalid" }),
  password: z.string().min(8, { message: "password must be at least 8 characters" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "email is invalid" }),
  password: z.string().min(1, { message: "password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "email is invalid" }),
});
