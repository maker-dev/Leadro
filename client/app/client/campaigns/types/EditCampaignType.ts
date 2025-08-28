import * as z from "zod";
import formSchema from "../schemas/EditCampaignSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
