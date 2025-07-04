"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadFormSchema } from "./schema";
import { CreateLeadFormValues } from "./types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

type CustomField = { label: string; value: string };

const CreateLeadForm = () => {
  const router = useRouter();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "",
      status: "new",
      message: "",
    },
    mode: "onBlur",
  });

  const handleAddCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { label: `Custom Field ${prev.length + 1}`, value: "" },
    ]);
  };

  const handleCustomFieldLabelChange = (idx: number, newLabel: string) => {
    setCustomFields((prev) =>
      prev.map((field, i) =>
        i === idx ? { ...field, label: newLabel } : field
      )
    );
  };

  const handleCustomFieldValueChange = (idx: number, newValue: string) => {
    setCustomFields((prev) =>
      prev.map((field, i) =>
        i === idx ? { ...field, value: newValue } : field
      )
    );
  };

  const onSubmit = (data: CreateLeadFormValues) => {
    // Include custom fields in submission
    const customFieldData = customFields.reduce((acc, field) => {
      acc[field.label] = field.value;
      return acc;
    }, {} as Record<string, string>);
    console.log({ ...data, customFields: customFieldData });
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg w-full max-w-5xl mx-auto p-10 md:p-20 flex flex-col gap-10"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter name"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              className={`border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter phone"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="source"
              className="text-sm font-medium text-gray-700"
            >
              Source
            </label>
            <input
              id="source"
              type="text"
              {...register("source")}
              className={`border ${
                errors.source ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter source"
            />
            {errors.source && (
              <span className="text-red-500 text-xs">
                {errors.source.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="border border-gray-300 rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <span className="text-red-500 text-xs">
                {errors.status.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            {...register("message")}
            className="border border-gray-300 rounded px-4 py-2 min-h-[80px] focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message here..."
          />
          {errors.message && (
            <span className="text-red-500 text-xs">
              {errors.message.message}
            </span>
          )}
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
          {customFields.map((field, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center relative"
            >
              <input
                type="text"
                value={field.label}
                onChange={(e) =>
                  handleCustomFieldLabelChange(idx, e.target.value)
                }
                className="border border-gray-300 rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400 font-semibold"
                placeholder="Field Label"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    handleCustomFieldValueChange(idx, e.target.value)
                  }
                  className="border border-gray-300 rounded px-4 py-2 h-11 focus:ring-2 focus:ring-blue-400"
                  placeholder="Field Value"
                />
                <button
                  type="button"
                  className="ml-2 px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 text-xs font-medium"
                  aria-label="Remove custom field"
                  onClick={() =>
                    setCustomFields((fields) =>
                      fields.filter((_, i) => i !== idx)
                    )
                  }
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

export default CreateLeadForm;
