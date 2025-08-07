import * as z from "zod";

const formSchema = z.object({
  label: z
    .string()
    .trim()
    .min(3, { message: "Label must be at least 3 characters long" })
    .max(100, { message: "Label must be at most 100 characters long" })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message:
        "Label can only contain letters, numbers, spaces, hyphens, and underscores",
    }),
});

export default formSchema;
