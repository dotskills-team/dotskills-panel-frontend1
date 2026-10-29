import { useAuthStore } from "./auth.store";

export const useCurrentUser = () =>
  useAuthStore((state) => state.user);

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useAuthLoading = () =>
  useAuthStore((state) => state.isLoading);

export const useAuthInitialized = () =>
  useAuthStore((state) => state.isInitialized);