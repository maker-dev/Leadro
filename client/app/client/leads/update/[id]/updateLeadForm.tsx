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
import { FiEdit } from "react-icons/fi";
import BaseCard from "@/components/ui/cards/BaseCard";
import LeadSourceOptions from "@/data/leadSourceOptions";
import { CreateLeadPayload, updateLead, getLead } from "@/services/LeadService";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Get allowed source values
const allowedSources = LeadSourceOptions.map((opt) => opt.value);
const getValidSource = (source: any): UpdateLeadFormValues["source"] =>
  allowedSources.includes(source) ? source : "";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

type UpdateLeadFormType = {
  leadId: string;
};

const validStatuses = ["new", "contacted", "converted", "lost"] as const;
const getValidStatus = (status: any): UpdateLeadFormValues["status"] =>
  validStatuses.includes(status) ? status : "new";

const UpdateLeadForm = ({ leadId }: UpdateLeadFormType) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<UpdateLeadFormValues>({
    resolver: zodResolver(updateLeadFormSchema),
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

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await getLead({ id: leadId });
        const lead = response.data;
        const customFields = lead.extraFields
          ? Object.entries(lead.extraFields).map(([label, value]) => ({
              label,
              value: String(value),
            }))
          : [];
        reset({
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          source: getValidSource(lead.source),
          status: getValidStatus(lead.status),
          message: lead.message || "",
          customFields,
        });
      } catch (err) {
        setFetchError("Lead not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const handleAddCustomField = () => {
    append({ label: "", value: "" });
  };

  const onSubmit: SubmitHandler<UpdateLeadFormValues> = async (data) => {
    // Transform custom fields from array of {label, value} to {label: value} format
    const customFieldsObject = (data.customFields ?? []).reduce(
      (acc, field) => {
        if (field.label && field.value) {
          acc[field.label] = field.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const { customFields, ...baseFields } = data;
    const transformedData = {
      ...baseFields,
      ...customFieldsObject,
    };

    // Remove empty string or null fields before sending
    const cleanedData = Object.fromEntries(
      Object.entries(transformedData).filter(
        ([, value]) => value !== "" && value !== null
      )
    );

    try {
      await updateLead({
        id: leadId,
        data: cleanedData as Partial<CreateLeadPayload>,
      });
      toast.success("Lead updated successfully");
      router.push(`/client/leads/view/${leadId}`);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field, { type: "server", message: err.message });
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Lead update failed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">Loading...</div>
    );
  }
  if (fetchError) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        {fetchError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <BaseCard
        logo={<FiEdit className="w-6 h-6" />}
        title="Lead Information"
        description="Edit the details for this lead."
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
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block align-middle mr-2"></span>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </BaseCard>
    </div>
  );
};

export default UpdateLeadForm;
