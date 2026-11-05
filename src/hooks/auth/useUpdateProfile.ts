"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: FormData) => userService.updateProfile(payload),

    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.me, response.data);
      setUser(response.data);
    },
  });
};

export const useChangeOwnPassword = () =>
  useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(payload),
  });
