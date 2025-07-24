"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import { FormValues } from "./types";
import { formSchema } from "./schema";
import { useEffect, useState } from "react";
import { resendVerificationEmail } from "@/services/AuthService";
import { toast } from "sonner";

export default function ResendVerificationForm() {
  const [cooldown, setCooldown] = useState(0);

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

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prevCooldown) => prevCooldown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: FormValues) => {
    try {
      await resendVerificationEmail(data);
      toast.success("Verification email has been resent");
      setCooldown(120);
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
        toast.error(
          "Resend verification email failed. Please try again later."
        );
      }
    }
  };

  const isButtonDisabled = isSubmitting || cooldown > 0;

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
      <SubmitButton disabled={isButtonDisabled} loading={isSubmitting}>
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Email"}
      </SubmitButton>
    </form>
  );
}
