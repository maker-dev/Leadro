import * as z from "zod";

export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Full name must be at least 3 characters long" }),

    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Za-z]/, { message: "Password must contain a letter" })
      .regex(/\d/, { message: "Password must contain a number" }),

    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
