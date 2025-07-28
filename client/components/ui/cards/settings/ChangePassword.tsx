import React from "react";
import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ChangePasswordSchema from "./schemas/ChangePasswordSchema";
import { FiLock } from "react-icons/fi";
import NormalTextInput from "../../inputs/NormalTextInput";
import FormValues from "./types/ChangePasswordType";
import { FaSpinner } from "react-icons/fa";
import BaseCard from "../BaseCard";

interface ChangePasswordProps {
  onSubmit?: (data: FormValues, setError: UseFormSetError<FormValues>) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onSubmit = () => {},
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
    mode: "onBlur",
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data, setError);
    reset();
  };

  return (
    <BaseCard
      logo={<FiLock className="w-6 h-6" aria-label="Change Password" />}
      title={"Change Password"}
      description={"Update your password to keep your account secure."}
    >
      <form
        autoComplete="off"
        aria-label="Change Password Form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          <div>
            <NormalTextInput
              label="New Password"
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              error={errors.newPassword}
              required
            />
          </div>
          <div>
            <NormalTextInput
              label="Confirm Password"
              id="confirmNewPassword"
              type="password"
              placeholder="Confirm new password"
              {...register("confirmNewPassword")}
              error={errors.confirmNewPassword}
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2 bg-black text-white rounded-md font-semibold shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
            aria-label="Update Password"
          >
            {isSubmitting ? (
              <FaSpinner className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <FiLock className="w-5 h-5" aria-hidden="true" />
            )}
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </BaseCard>
  );
};

export default ChangePassword;
