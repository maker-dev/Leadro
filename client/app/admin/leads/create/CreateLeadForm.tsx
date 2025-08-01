"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadFormSchema } from "./schema";
import { CreateLeadFormValues } from "./types";
import { useRouter } from "next/navigation";
import NormalTextInput from "@/components/ui/inputs/NormalTextInput";
import NormalSelectInput from "@/components/ui/inputs/NormalSelectInput";
import NormalTextAreaInput from "@/components/ui/inputs/NormalTextAreaInput";
import BaseCard from "@/components/ui/cards/BaseCard";
import { FiUser } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import DropDownSelector, {
  DropDownOption,
} from "@/components/ui/inputs/DropDownSelector";
import { useEffect, useState } from "react";
import LeadSourceOptions from "@/data/leadSourceOptions";
import { getAllClients } from "@/services/AdminService";
import {
  createLeadForClient,
  CreateLeadForClientPayload,
} from "@/services/LeadService";
import { toast } from "sonner";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

// Client interface based on the API response
interface Client {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const CreateLeadForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
    control,
    setValue,
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
      clientEmail: "",
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  // State for selected client and client options
  const [selectedClient, setSelectedClient] = useState<DropDownOption | null>(
    null
  );
  const [clientOptions, setClientOptions] = useState<DropDownOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleAddCustomField = () => {
    append({ label: "", value: "" });
  };

  const onSubmit = async (data: CreateLeadFormValues) => {
    // Check if a client is selected
    if (!data.clientEmail) {
      setClientError("Please select a client");
      return;
    }

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
      await createLeadForClient(cleanedData as CreateLeadForClientPayload);
      toast.success("Lead created successfully");
      reset();
      setSelectedClient(null); // Reset the dropdown selection
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
        toast.error("Lead creation failed. Please try again.");
      }
    }
  };

  // When a client is selected, update the form value
  const handleClientChange = (option: DropDownOption | null) => {
    setSelectedClient(option);
    setValue("clientEmail", option ? option.value : "");
  };

  // Fetch clients from the API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        setClientError(null);

        const response = await getAllClients();

        if (response.success && response.data) {
          // Transform client data to DropDownOption format
          const transformedClients: DropDownOption[] = response.data.map(
            (client: Client) => ({
              value: client.email,
              label: client.name,
              subtext: client.email,
            })
          );

          setClientOptions(transformedClients);
        } else {
          setClientError("Failed to load clients");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClientError("Failed to load clients. Please try again.");
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Select Client */}
      <BaseCard
        logo={<FiUser className="w-6 h-6 text-gray-700" />}
        title="Select Client"
        description="Choose the client you want to add a lead for"
      >
        <div>
          <DropDownSelector
            options={isLoadingClients ? [] : clientOptions}
            value={selectedClient}
            onChange={handleClientChange}
            placeholder={
              isLoadingClients ? "Loading clients..." : "Select client..."
            }
            className="w-full"
          />
          {clientError && (
            <span className="text-xs text-red-500 mt-1 block">
              {clientError}
            </span>
          )}
          {errors.clientEmail && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.clientEmail.message as string}
            </span>
          )}
        </div>
      </BaseCard>

      {/* Lead information */}
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
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
              aria-label="Save"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
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

export default CreateLeadForm;
