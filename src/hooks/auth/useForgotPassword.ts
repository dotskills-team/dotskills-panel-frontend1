"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/axios";
import { authService } from "@/services/auth.service";
import type { ForgotPasswordPayload } from "@/types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),

    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to send the reset link. Please try again.";

      toast.error(message);
    },
  });
}