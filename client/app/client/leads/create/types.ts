import { z } from "zod";
import { createLeadFormSchema } from "./schema";

export type CreateLeadFormValues = z.infer<typeof createLeadFormSchema>;
