import { z } from "zod";
import { LeadSourceValues } from "@/data/leadSourceOptions";

export const customFieldSchema = z.object({
  label: z.string().min(1, "Custom field label is required"),
  value: z.string().min(1, "Custom field value is required"),
});

const RESERVED_KEYS = ["name", "email", "phone", "source", "status", "message"];

export const updateLeadFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(
        /^[a-zA-Z0-9\s\-'.]+$/,
        "Name can only contain letters, numbers, spaces, and basic punctuation"
      )
      .or(z.literal(""))
      .optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please provide a valid email"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val),
        {
          message: "Please provide a valid phone number",
        }
      ),
    source: z
      .enum(LeadSourceValues)
      .or(z.literal(""))
      .optional()
      .refine((val) => !val || (val.length >= 2 && val.length <= 50), {
        message: "Source must be between 2 and 50 characters",
      }),
    status: z.enum(["new", "contacted", "converted", "lost"], {
      required_error: "Status is required",
    }),
    message: z
      .string()
      .max(1000, "Message cannot exceed 1000 characters")
      .optional(),
    customFields: z.array(customFieldSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.customFields) {
      data.customFields.forEach((field, idx) => {
        if (RESERVED_KEYS.includes(field.label.trim().toLowerCase())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This label is reserved.",
            path: ["customFields", idx, "label"],
          });
        }
      });
    }
  });
