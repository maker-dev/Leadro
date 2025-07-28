import * as z from "zod";

const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Za-z]/, { message: "Password must contain a letter" })
      .regex(/\d/, { message: "Password must contain a number" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export default ChangePasswordSchema;
