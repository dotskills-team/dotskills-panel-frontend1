"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores";

export const useCurrentUser = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const reset = useAuthStore((state) => state.reset);

  return useQuery({
    queryKey: queryKeys.auth.me,

    retry: false,

    staleTime: 1000 * 60 * 10,

    gcTime: 1000 * 60 * 30,

    queryFn: async () => {
      try {
        const user = await userService.me();

        initialize(user);

        return user;
      } catch (error) {
        reset();
        throw error;
      }
    },
  });
};