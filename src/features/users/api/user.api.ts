import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type { User } from "@/types/user.types";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
  department?: string;
  designation?: string;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  designation?: string;
  department?: string;
  address?: string;
  avatar?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  designation?: string;
  department?: string;
  address?: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserStatusPayload {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

const BASE_URL = "/user";

const buildQuery = (params?: GetUsersParams) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const userApi = {
  getUsers: (params?: GetUsersParams) =>
    apiClient.get<ApiResponse<User[]>>(`${BASE_URL}${buildQuery(params)}`),

  getUser: (id: string) =>
    apiClient.get<ApiResponse<User>>(`${BASE_URL}/${id}`),

  createUser: (payload: CreateUserPayload) =>
    apiClient.post<ApiResponse<User>>(`${BASE_URL}/create`, payload),

  updateUser: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<ApiResponse<User>>(`${BASE_URL}/${id}`, payload),

  deleteUser: (id: string) =>
    apiClient.patch<ApiResponse<{ _id: string }>>(`${BASE_URL}/${id}/soft-delete`),

  updateStatus: (id: string, payload: UpdateUserStatusPayload) =>
    apiClient.patch<ApiResponse<User>>(`${BASE_URL}/${id}/status`, payload),

  bulkUpdateStatus: (ids: string[], payload: UpdateUserStatusPayload) =>
    apiClient.patch<ApiResponse<User[]>>(`${BASE_URL}/bulk/status`, {
      ids,
      ...payload,
    }),

  bulkDeleteUsers: (ids: string[]) =>
    apiClient.post<ApiResponse<{ deleted: number }>>(`${BASE_URL}/bulk/delete`, {
      ids,
    }),
};

export default userApi;
