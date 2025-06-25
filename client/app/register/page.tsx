"use client";

import SubmitButton from "@/components/ui/buttons/SubmitButton";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import TextInput from "@/components/ui/inputs/TextInput";
import Image from "next/image";
import registerImage from "@/assets/images/account-registration.png";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-end text-sm text-gray-500 mb-6 mt-2">
              Already Have an account?{" "}
              <Link
                href={"/login"}
                className="ml-1 font-semibold text-black hover:underline"
              >
                Login
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-center mb-1 mt-2">
              Welcome
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Best tool for business management
            </p>
            <form className="flex flex-col gap-4">
              <TextInput
                label="Full Name"
                name="name"
                placeholder="Nanyonga Rahmah"
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="ugaka1204@gmail.com"
              />
              <PasswordInput label="Password" name="password" placeholder="" />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder=""
              />
              <SubmitButton>Sign Up</SubmitButton>
            </form>
            <p className="text-xs text-gray-400 text-center mt-4">
              By clicking on sign up, you agree to Leadro's{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src={registerImage}
            alt="Register visual"
            fill
            className="object-cover h-full w-full"
            sizes="(min-width: 768px) 50vw, 0vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
