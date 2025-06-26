import Image from "next/image";
import forgotPassword from "@/assets/images/forgot-password.svg";
import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-[#f6fbfc]">
          <div className="relative w-96 h-96">
            <Image
              src={forgotPassword}
              alt="Forgot password illustration"
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
              Forgot <span className="text-black">Your Password</span>?
            </h1>
            <p className="text-gray-500 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <ForgotPasswordForm />
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
};

export default ForgotPasswordPage;
