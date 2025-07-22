"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import Link from "next/link";
import { FormValues } from "./types";
import { formSchema } from "./schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/AuthService";

export default function LoginForm() {
  const { setToken } = useAuth();
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
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await loginUser(data);
      setToken(res.token);
      toast.success("Login successful!");
      reset();
      if (res.data.role === "client") {
        router.push("/client/dashboard");
      } else if (res.data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field, { type: "server", message: err.message });
          } else if (err.message === "Email not verified") {
            router.push("resend-verification");
            toast.error(err.message);
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Login failed. Please try again.");
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
