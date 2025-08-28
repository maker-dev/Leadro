import * as z from "zod";
import formSchema from "../schemas/CampaignFieldSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
