import * as z from "zod";
import formSchema from "../schemas/ChangePasswordSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
