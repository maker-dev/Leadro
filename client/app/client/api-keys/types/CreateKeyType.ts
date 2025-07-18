import * as z from "zod";
import formSchema from "../schemas/CreateKeySchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
