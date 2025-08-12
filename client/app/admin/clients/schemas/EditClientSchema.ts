import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name must contain only letters and spaces",
    }),

  email: z.string().trim().email({ message: "Must be a valid email address" }),
});

export default formSchema;
