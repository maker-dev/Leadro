"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { getProfile } from "@/services/ProfileService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async () => {
    try {
      const res = await getProfile();
      const { _id, name, email, role } = res.data;
      setUser({ _id, name, email, role });
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
