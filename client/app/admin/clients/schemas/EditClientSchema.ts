import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters long" }),

  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
});

export default formSchema;
