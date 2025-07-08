"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateLeadFormSchema } from "./schema";
import { UpdateLeadFormValues } from "./types";
import { useRouter } from "next/navigation";
import NormalTextInput from "@/components/ui/inputs/NormalTextInput";
import NormalSelectInput from "@/components/ui/inputs/NormalSelectInput";
import NormalTextAreaInput from "@/components/ui/inputs/NormalTextAreaInput";
import { SubmitHandler } from "react-hook-form";
import { usePathname } from "next/navigation";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

// Fake data type
const fakeLeads = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    source: "Website",
    status: "new",
    createdAt: "2023-01-01",
    extraFields: {
      Address: "Rue 45",
    },
  },
  {
    id: 2,
    name: "",
    email: "jane@example.com",
    phone: "",
    source: "Referral",
    status: "contacted",
    createdAt: "2023-01-02",
  },
  {
    id: 3,
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "9876543210",
    source: "Ad Campaign",
    status: "converted",
    createdAt: "2023-01-03",
  },
  {
    id: 4,
    name: "Bob Lee",
    email: "bob@example.com",
    phone: "",
    source: "",
    status: "lost",
    createdAt: "2023-01-04",
  },
  {
    id: 5,
    name: "",
    email: "eve@example.com",
    phone: "5551234567",
    source: "Website",
    status: "new",
    createdAt: "2023-01-05",
  },
  {
    id: 6,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "",
    source: "Event",
    status: "contacted",
    createdAt: "2023-01-06",
  },
  {
    id: 7,
    name: "",
    email: "dave@example.com",
    phone: "",
    source: "",
    status: "converted",
    createdAt: "2023-01-07",
  },
  {
    id: 8,
    name: "Emily White",
    email: "emily@example.com",
    phone: "4445556666",
    source: "Referral",
    status: "lost",
    createdAt: "2023-01-08",
  },
];

const UpdateLeadForm = () => {
  const router = useRouter();
  const pathname = usePathname(); // e.g., /leads/update/123
  const segments = pathname.split("/");
  const lastParam = segments[segments.length - 1];
  // Find the lead by id (convert id to number for comparison)
  const lead = fakeLeads.find((l) => l.id === Number(lastParam));

  // Map extraFields to customFields array if present
  const customFields = lead?.extraFields
    ? Object.entries(lead.extraFields).map(([label, value]) => ({
        label,
        value,
      }))
    : [];

  // Helper to ensure status is a valid enum value
  const validStatuses = ["new", "contacted", "converted", "lost"] as const;
  const getValidStatus = (status: any): UpdateLeadFormValues["status"] =>
    validStatuses.includes(status) ? status : "new";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<UpdateLeadFormValues>({
    resolver: zodResolver(updateLeadFormSchema),
    defaultValues: lead
      ? {
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          source: lead.source || "",
          status: getValidStatus(lead.status),
          message: "",
          customFields,
        }
      : {
          name: "",
          email: "",
          phone: "",
          source: "",
          status: "new",
          message: "",
          customFields: [],
        },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const handleAddCustomField = () => {
    append({ label: "", value: "" });
  };

  const onSubmit: SubmitHandler<UpdateLeadFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg w-full max-w-5xl mx-auto p-10 md:p-20 flex flex-col gap-5"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <NormalTextInput
            label="Name"
            id="name"
            type="text"
            required
            error={errors.name}
            placeholder="Enter name"
            {...register("name")}
          />
          <NormalTextInput
            label="Email"
            id="email"
            type="email"
            required
            error={errors.email}
            placeholder="Enter email"
            {...register("email")}
          />
          <NormalTextInput
            label="Phone"
            id="phone"
            type="text"
            error={errors.phone}
            placeholder="Enter phone"
            {...register("phone")}
          />
          <NormalTextInput
            label="Source"
            id="source"
            type="text"
            error={errors.source}
            placeholder="Enter source"
            {...register("source")}
          />
        </div>
        <div className="grid grid-cols-1">
          <NormalSelectInput
            label="Status"
            id="status"
            options={statusOptions}
            error={errors.status}
            required
            {...register("status")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <NormalTextAreaInput
            label="Message"
            id="message"
            error={errors.message}
            placeholder="Type your message here..."
            {...register("message")}
          />
        </div>
        {/* Custom Fields Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Custom Fields</span>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium"
              onClick={handleAddCustomField}
            >
              + Add Field
            </button>
          </div>
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center relative"
            >
              <NormalTextInput
                label={`Label ${idx + 1}`}
                id={`customFields.${idx}.label`}
                placeholder="Field Label"
                error={errors.customFields?.[idx]?.label}
                {...register(`customFields.${idx}.label` as const)}
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <NormalTextInput
                    label={`Value ${idx + 1}`}
                    id={`customFields.${idx}.value`}
                    placeholder="Field Value"
                    error={errors.customFields?.[idx]?.value}
                    {...register(`customFields.${idx}.value` as const)}
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 text-xs font-medium"
                  aria-label="Remove custom field"
                  onClick={() => remove(idx)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <button
            type="button"
            className="px-6 py-2 rounded border border-blue-500 text-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onClick={() => router.back()}
            tabIndex={0}
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={isSubmitting}
            aria-label="Save"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLeadForm;
