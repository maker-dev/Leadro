"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

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
    setToken(null);
    // optionally call logout API to clear cookie
  };

  // On mount: load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken); // uses our setter with role decode
    }
    setLoading(false);
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
