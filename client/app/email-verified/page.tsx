"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MdOutlineMarkEmailRead,
  MdErrorOutline,
  MdAccessTime,
} from "react-icons/md";

const statusConfig = {
  success: {
    icon: <MdOutlineMarkEmailRead className="w-12 h-12 text-[#31B5B2]" />,
    title: "Email verified!",
    message: "Your email has been successfully verified. You can now sign in.",
    action: (
      <Link
        href="/login"
        className="mt-6 px-6 py-2 rounded-lg bg-[#31B5B2] text-white font-semibold hover:bg-[#269e9b] transition-colors"
      >
        Sign in
      </Link>
    ),
  },
  "token-expired": {
    icon: <MdAccessTime className="w-12 h-12 text-yellow-500" />,
    title: "Verification link expired",
    message: "Your verification link has expired. Please request a new one.",
    action: (
      <Link
        href="/resend-verification"
        className="mt-6 px-6 py-2 rounded-lg bg-[#31B5B2] text-white font-semibold hover:bg-[#269e9b] transition-colors"
      >
        Resend Verification
      </Link>
    ),
  },
  error: {
    icon: <MdErrorOutline className="w-12 h-12 text-red-500" />,
    title: "Something went wrong",
    message:
      "We couldn't verify your email. Please try again or contact support.",
    action: (
      <Link
        href="/resend-verification"
        className="mt-6 px-6 py-2 rounded-lg bg-[#31B5B2] text-white font-semibold hover:bg-[#269e9b] transition-colors"
      >
        Try Again
      </Link>
    ),
  },
} as const;

type StatusKey = keyof typeof statusConfig;

function isStatusKey(key: string): key is StatusKey {
  return key in statusConfig;
}

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") || "success";
  const status: StatusKey = isStatusKey(statusParam) ? statusParam : "error";
  const config = statusConfig[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-[#31B5B2]/10">
          {config.icon}
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">{config.title}</h1>
        <p className="text-gray-500 text-center mb-2">{config.message}</p>
        {config.action}
      </div>
    </div>
  );
}
