"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import { FormValues } from "./types";
import { formSchema } from "./schema";
import { forgotPassword } from "@/services/AuthService";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await forgotPassword(data);
      toast.success("Reset link sent to your email");
      reset();
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
        toast.error("Failed to send reset link. Please try again later.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <TextInput
        label="Email"
        type="email"
        placeholder="ugaka1204@gmail.com"
        {...register("email")}
        error={errors.email}
      />
      <SubmitButton disabled={isSubmitting} loading={isSubmitting}>
        Send Reset Link
      </SubmitButton>
    </form>
  );
}
