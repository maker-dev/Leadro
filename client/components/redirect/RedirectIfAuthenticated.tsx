"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RedirectIfAuthenticated() {
  const { token, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (token) {
      router.replace(
        role === "admin" ? "/admin/dashboard" : "/client/dashboard"
      );
    }
  }, [token, role, loading]);

  return null;
}
