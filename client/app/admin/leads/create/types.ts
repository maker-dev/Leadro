import { z } from "zod";
import { createLeadFormSchema, customFieldSchema } from "./schema";

export type customFieldValues = z.infer<typeof customFieldSchema>;

export type CreateLeadFormValues = z.infer<typeof createLeadFormSchema>;
