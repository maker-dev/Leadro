"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import type { FormValues } from "./types";
import TextInput from "@/components/ui/inputs/TextInput";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const onSubmit = (data: FormValues) => {
    console.log(data);
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
