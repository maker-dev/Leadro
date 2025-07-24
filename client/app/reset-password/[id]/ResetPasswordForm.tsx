"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import { FormValues } from "./types";
import { formSchema } from "./schema";
import { useParams } from "next/navigation";
import { resetPassword } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await resetPassword({
        token: id,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successful");
      reset();
      router.push("/login");
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field === "token" && err.message) {
            toast.error(err.message);
          } else if (err.field && err.message) {
            setError(err.field, { type: "server", message: err.message });
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Password reset failed. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <PasswordInput
        label="Password"
        placeholder="Password"
        {...register("password")}
        error={errors.password}
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm Password"
        {...register("confirmPassword")}
        error={errors.confirmPassword}
      />
      <SubmitButton disabled={isSubmitting} loading={isSubmitting}>
        Reset Password
      </SubmitButton>
    </form>
  );
}
