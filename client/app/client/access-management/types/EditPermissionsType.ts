import * as z from "zod";
import formSchema from "../schemas/EditPermissionsSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
