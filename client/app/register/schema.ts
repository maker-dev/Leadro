import * as z from "zod";

export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Full name must be at least 3 characters long" })
      .max(50, { message: "Full name must be at most 50 characters long" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Name must contain only letters and spaces",
      }),

    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
      .regex(/\d/, { message: "Password must contain a number" }),

    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
