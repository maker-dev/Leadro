import * as z from "zod";
import formSchema from "../schemas/EditKeySchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
