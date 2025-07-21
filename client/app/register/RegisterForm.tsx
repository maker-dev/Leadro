"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import type { FormValues } from "./types";
import TextInput from "@/components/ui/inputs/TextInput";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import { registerUser } from "@/services/authService";
import { toast } from "sonner";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data);
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
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
        toast.error("Registration failed. Please try again.");
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
        label="Full Name"
        placeholder="Nanyonga Rahmah"
        {...register("name")}
        error={errors.name}
      />
      <TextInput
        label="Email"
        type="email"
        placeholder="ugaka1204@gmail.com"
        {...register("email")}
        error={errors.email}
      />
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
        Sign Up
      </SubmitButton>
    </form>
  );
}
