import * as z from "zod";
import formSchema from "../schemas/EditClientSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
