import * as z from "zod";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
  permissions: z
    .array(z.enum(["read", "update", "delete"]))
    .min(1, { message: "At least one permission is required" }),
});

export default formSchema;
