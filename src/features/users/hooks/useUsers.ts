"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userApi, type GetUsersParams } from "../api/user.api";
import { userKeys } from "../api/user.keys";

interface UseUsersOptions {
  enabled?: boolean;
}

export const useUsers = (params?: GetUsersParams, options?: UseUsersOptions) => {
  return useQuery({
    queryKey: userKeys.list(params as Record<string, unknown>),
    queryFn: () => userApi.getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled !== false,
  });
};

export const useUser = (id?: string, options?: UseUsersOptions) => {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => userApi.getUser(id!),
    enabled: Boolean(id) && options?.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
};
