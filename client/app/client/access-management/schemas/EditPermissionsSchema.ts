import { z } from "zod";

const editPermissionsSchema = z.object({
  permissions: z
    .array(z.enum(["read", "update", "delete"]))
    .min(1, "Select at least one permission")
    .refine((perms) => !perms.includes("update") || perms.includes("read"), {
      message: "Read is required if Update is selected",
      path: ["permissions"],
    })
    .refine((perms) => !perms.includes("delete") || perms.includes("read"), {
      message: "Read is required if Delete is selected",
      path: ["permissions"],
    }),
});

export default editPermissionsSchema;
