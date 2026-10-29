"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type { IUserSummary } from "@/types/lead";

export const useAssignableUsers = () => {
  return useQuery({
    queryKey: ["users", "assignable"],
    queryFn: () =>
      apiClient.get<ApiResponse<IUserSummary[]>>(
        "/user?fields=firstName,lastName,email,designation&limit=100&sort=firstName",
      ),
    staleTime: 1000 * 60 * 10,
  });
};
