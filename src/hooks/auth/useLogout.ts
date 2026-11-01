"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";

import { useAuthStore } from "@/stores";

/**
 * Single logout flow. Calls the backend (POST /auth/logout, withCredentials)
 * so the backend-domain httpOnly cookies are cleared, then wipes all
 * client-side auth state so no cached `auth.me` survives.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const reset = useAuthStore((state) => state.reset);

  return useMutation({
    mutationFn: () => authService.logout(),

    onSettled: () => {
      reset();

      queryClient.clear();

      router.replace("/login");
      router.refresh();
    },
  });
};
