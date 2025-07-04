import * as z from "zod";
import formSchema from "../schemas/AddClientSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
