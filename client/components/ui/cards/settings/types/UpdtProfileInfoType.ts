import * as z from "zod";
import formSchema from "../schemas/UpdtProfileInfoSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
