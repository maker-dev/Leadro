import * as z from "zod";

const formSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, { message: "Field label must be at least 2 characters long" })
    .max(20, { message: "Field label must be at most 20 characters long" }),
  type: z
    .string()
    .min(1, { message: "Field type is required" }),
  required: z
    .boolean(),
  options: z
    .string()
    .optional(),
});

export default formSchema;
