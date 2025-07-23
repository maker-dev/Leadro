"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import AquaPulseLoader from "../ui/loaders/AquaPulseLoaderWrapper";

interface AuthGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const { token, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace("/login");
    } else if (!role || !allowedRoles.includes(role)) {
      router.replace("/unauthorized"); // or /client, or /not-allowed
    }
  }, [token, role, loading]);

  if (loading) {
    return <AquaPulseLoader />;
  }

  if (!token || !allowedRoles.includes(role || "")) return null;

  return <>{children}</>;
}
