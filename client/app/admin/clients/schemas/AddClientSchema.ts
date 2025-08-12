import * as z from "zod";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Name must contain only letters and spaces",
      }),

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

export default formSchema;
