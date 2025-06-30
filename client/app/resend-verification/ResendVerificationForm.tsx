"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import { FormValues } from "./types";
import { formSchema } from "./schema";
import { useEffect, useState } from "react";

export default function ResendVerificationForm() {
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
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

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setCooldown(30);
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
