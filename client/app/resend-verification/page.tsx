"use client";

import Link from "next/link";
import Image from "next/image";
import sendVerification from "@/assets/images/send-verification.svg";
import ResendVerificationForm from "./ResendVerificationForm";

const ResendVerificationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          {/* Email Image Circle */}
          <div className="w-28 h-28 rounded-full bg-[#31B5B2]/10 flex items-center justify-center mb-6">
            <Image
              src={sendVerification}
              alt="Send verification"
              width={96}
              height={96}
              className="object-contain object-center w-28 h-28"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-4">
            Verify your email address
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-center mb-2">
            Please provide your email to receive a new verification link.
          </p>
          <p className="text-gray-500 text-center mb-6">
            Click on the link to complete the verification process. You might
            need to check your spam folder.
          </p>

          {/* Form */}
          <div className="w-full max-w-sm">
            <ResendVerificationForm />
          </div>

          {/* Return Link */}
          <Link
            href="/login"
            className="mt-6 text-[#31B5B2] hover:text-[#269e9b] font-medium flex items-center gap-2"
          >
            Return to Site →
          </Link>

          {/* Help Text */}
          <p className="text-sm text-gray-400 text-center mt-6">
            You can reach us at if you have any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
