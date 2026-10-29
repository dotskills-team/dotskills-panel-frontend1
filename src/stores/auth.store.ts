import { create } from "zustand";

import type { User } from "@/types";

interface AuthState {
  user: User | null;

  isAuthenticated: boolean;

  isInitialized: boolean;

  isLoading: boolean;

  setUser: (user: User | null) => void;

  setLoading: (loading: boolean) => void;

  setInitialized: (initialized: boolean) => void;

  initialize: (user: User | null) => void;

  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setInitialized: (initialized) =>
    set({
      isInitialized: initialized,
    }),

  initialize: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      isInitialized: true,
      isLoading: false,
    }),

  reset: () =>
    set({
      ...initialState,
      isInitialized: true,
      isLoading: false,
    }),
}));