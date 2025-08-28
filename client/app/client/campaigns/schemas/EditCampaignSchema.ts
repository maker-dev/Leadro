import * as z from "zod";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Campaign title must be at least 3 characters long" })
    .max(30, { message: "Campaign title must be at most 100 characters long" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "Description must be at least 5 characters long" })
    .max(500, { message: "Description must be at most 500 characters long" }),
});

export default formSchema;
