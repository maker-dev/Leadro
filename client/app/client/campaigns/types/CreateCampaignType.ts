import * as z from "zod";
import formSchema from "../schemas/CreateCampaignSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
