"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import Link from "next/link";
import { FormValues } from "./types";
import { formSchema } from "./schema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-gray-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <SubmitButton disabled={isSubmitting} loading={isSubmitting}>
        Login
      </SubmitButton>
    </form>
  );
}
