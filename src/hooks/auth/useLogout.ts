"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";

import { useAuthStore } from "@/stores";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const reset = useAuthStore((state) => state.reset);

  return useMutation({
    mutationFn: () => authService.logout(),

    onSettled: async () => {
      reset();

      queryClient.clear();
    },
  });
};