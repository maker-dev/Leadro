"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadFormSchema } from "./schema";
import { CreateLeadFormValues } from "./types";
import { useRouter } from "next/navigation";
import NormalTextInput from "@/components/ui/inputs/NormalTextInput";
import NormalSelectInput from "@/components/ui/inputs/NormalSelectInput";
import NormalTextAreaInput from "@/components/ui/inputs/NormalTextAreaInput";
import { FiPlus } from "react-icons/fi";
import BaseCard from "@/components/ui/cards/BaseCard";
import LeadSourceOptions from "@/data/leadSourceOptions";
const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const CreateLeadForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadFormSchema),
    defaultValues: {
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

  const onSubmit = (data: CreateLeadFormValues) => {
    console.log(data);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <BaseCard
        logo={<FiPlus className="w-6 h-6" />}
        title="Lead Information"
        description="Fill in the details for the new lead."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
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
            <NormalSelectInput
              label="Source"
              id="source"
              options={[
                { label: "No Source", value: "" },
                ...LeadSourceOptions,
              ]}
              error={errors.source}
              required
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
      </BaseCard>
    </div>
  );
};

export default CreateLeadForm;
