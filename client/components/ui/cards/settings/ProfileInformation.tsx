import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema from "./schemas/UpdtProfileInfoSchema";
import FormValues from "./types/UpdtProfileInfoType";
import NormalTextInput from "@/components/ui/inputs/NormalTextInput";
import { FiUser, FiShield, FiSave } from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import BaseCard from "../BaseCard";

interface ProfileInformationProps {
  initialValues: { name: string; email: string };
  onSubmit: (data: FormValues) => void;
  role: "Admin" | "Client";
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({
  initialValues,
  onSubmit,
  role,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: initialValues.name },
    mode: "onBlur",
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    // Optionally reset or keep as is
  };

  return (
    <>
      <BaseCard
        logo={<FiUser className="w-6 h-6" aria-label="Profile" />}
        title="Profile Information"
        description="Update your personal information and account details."
      >
        <form
          autoComplete="off"
          aria-label="Profile Information Form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 md:mb-2">
            <div>
              <NormalTextInput
                label="Name"
                id="name"
                {...register("name")}
                error={errors.name}
                required
              />
            </div>
            <div>
              <NormalTextInput
                label="Email"
                id="email"
                name="email"
                type="email"
                value={initialValues.email}
                readOnly
                disabled
                className="w-full px-4 py-2 border border-gray-100 bg-gray-100 rounded-md text-gray-400 cursor-not-allowed text-base"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <span
              className={`inline-flex items-center px-4 py-1 rounded-full text-white text-sm font-medium gap-2 ${
                role === "Admin" ? "bg-red-500" : "bg-blue-500"
              }`}
              tabIndex={0}
              aria-label={`Role: ${role}`}
            >
              {role === "Admin" ? (
                <FiShield className="w-4 h-4" aria-hidden="true" />
              ) : (
                <RiUserSettingsLine className="w-4 h-4" aria-hidden="true" />
              )}
              {role}
            </span>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md font-semibold shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 cursor-pointer"
              aria-label="Save Changes"
              tabIndex={0}
            >
              <FiSave className="w-5 h-5" aria-hidden="true" />
              Save Changes
            </button>
          </div>
        </form>
      </BaseCard>
    </>
  );
};

export default ProfileInformation;
