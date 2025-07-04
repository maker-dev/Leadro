import ResetPasswordForm from "./ResetPasswordForm";
import resetPassword from "@/assets/images/Reset-password.svg";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export default function ResetPasswordPage({ params }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-[#f6fbfc]">
          <div className="relative w-full h-full min-h-[300px]">
            <Image
              src={resetPassword}
              alt="Reset password illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        {/* Right: Form */}
        <div className="flex-1 p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Create a New Password
            </h1>
            <p className="text-gray-500 mb-6">
              Your new password must be different from previous used passwords.
            </p>
            <ResetPasswordForm />
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
