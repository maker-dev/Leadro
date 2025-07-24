"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface AuthContextType {
  token: string | null;
  role: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser, fetchUserProfile } = useUser();
  const router = useRouter();
  // Helper: decode role from JWT
  const decodeRoleFromToken = (token: string): string | null => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.role || null;
    } catch {
      return null;
    }
  };

  // Setter that syncs both token and role with localStorage
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);

    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      const extractedRole = decodeRoleFromToken(newToken);
      setRole(extractedRole);
    } else {
      localStorage.removeItem("accessToken");
      setRole(null);
    }
  };

  // Logout function clears token and role
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setToken(null);
      setUser(null);
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // On mount: load token from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken) {
        setToken(savedToken); // uses our setter with role decode
        await fetchUserProfile();
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, loading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
