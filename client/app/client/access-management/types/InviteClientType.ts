import * as z from "zod";
import formSchema from "../schemas/InviteClientSchema";

type FormValues = z.infer<typeof formSchema>;

export default FormValues;
