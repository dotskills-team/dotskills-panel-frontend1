"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores";
import type { LoginPayload } from "@/types";

const DEFAULT_REDIRECT_PATH = "/dashboard";

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),

    onSuccess: (response) => {
      setUser(response.data.user);

      toast.success(response.message || "Welcome back.");

      router.replace(DEFAULT_REDIRECT_PATH);
      router.refresh();
    },

    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to sign in. Please try again.";

      toast.error(message);
    },
  });
}