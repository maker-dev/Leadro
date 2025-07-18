import * as z from "zod";

const formSchema = z.object({
  label: z
    .string()
    .trim()
    .min(3, { message: "Label must be at least 3 characters long" }),
});

export default formSchema;
