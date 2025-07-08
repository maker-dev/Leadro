import { z } from "zod";
import { updateLeadFormSchema, customFieldSchema } from "./schema";

export type customFieldValues = z.infer<typeof customFieldSchema>;

export type UpdateLeadFormValues = z.infer<typeof updateLeadFormSchema>;
