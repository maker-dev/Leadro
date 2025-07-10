import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters long" }),
});

export default formSchema;
