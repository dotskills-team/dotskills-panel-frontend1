"use client";

import React, { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores";
import type { User } from "@/types";

type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

/**
 * The user comes from the auth store, which AuthInitializer / useCurrentUser fill
 * from GET /user/me (a browser request with credentials).
 *
 * Do NOT read the user from Next.js cookies (getCurrentUser server action): in
 * production the auth cookies live on the backend domain, so the Next.js server
 * never sees them and the user would always be null. Locally it only appeared to
 * work because localhost cookies are shared across ports.
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const resetAuthStore = useAuthStore((state) => state.reset);
  const queryClient = useQueryClient();

  const login = (userData: User) => setUser(userData);

  // Must hit the backend: the auth cookies live on the backend domain and are
  // httpOnly, so a Next.js server action (logoutUser) cannot clear them.
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      resetAuthStore();
      queryClient.clear();
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
