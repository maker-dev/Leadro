import { z } from "zod";

export const customFieldSchema = z.object({
  label: z.string().min(1, "Custom field label is required"),
  value: z.string().min(1, "Custom field value is required"),
});

export const updateLeadFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .or(z.literal(""))
    .optional(),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?\d{7,15}$/.test(val), {
      message: "Invalid phone number",
    }),
  source: z
    .string()
    .min(3, "Source must be at least 3 characters")
    .or(z.literal(""))
    .optional(),
  status: z.enum(["new", "contacted", "converted", "lost"], {
    required_error: "Status is required",
  }),
  message: z
    .string()
    .max(500, "Message must be at most 500 characters")
    .optional(),
  customFields: z.array(customFieldSchema).optional(),
});
