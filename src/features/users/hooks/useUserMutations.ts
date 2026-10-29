/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../api/user.api";
import { userKeys } from "../api/user.keys";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
} from "../api/user.api";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to create user");
    },
  });
};

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      userApi.updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserStatusPayload;
    }) => userApi.updateStatus(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ids,
      payload,
    }: {
      ids: string[];
      payload: UpdateUserStatusPayload;
    }) => userApi.bulkUpdateStatus(ids, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Users updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update users");
    },
  });
};

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => userApi.bulkDeleteUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Users deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete users");
    },
  });
};
