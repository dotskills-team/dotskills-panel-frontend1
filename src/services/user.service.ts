import { apiClient } from "@/lib/axios";

import type {
  ApiResponse,
  PaginationMeta,
  Role,
  User,
  UserStatus,
} from "@/types";

class UserService {
async me(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>(
    "/user/me",
  );

  return response.data;
}

  create(payload: Partial<User>) {
    return apiClient.post<ApiResponse<User>>(
      "/user",
      payload,
    );
  }

  getUsers(params?: Record<string, unknown>) {
    return apiClient.get<
      ApiResponse<User[]> & {
        meta: PaginationMeta;
      }
    >("/user", {
      params,
    });
  }

  getDeletedUsers(params?: Record<string, unknown>) {
    return apiClient.get<
      ApiResponse<User[]> & {
        meta: PaginationMeta;
      }
    >("/user/deleted", {
      params,
    });
  }

  getById(id: string) {
    return apiClient.get<ApiResponse<User>>(
      `/user/${id}`,
    );
  }

  update(id: string, payload: Partial<User>) {
    return apiClient.patch<ApiResponse<User>>(
      `/user/${id}`,
      payload,
    );
  }

  /** Updates the logged-in user's name / avatar. Send FormData when uploading an image. */
  updateProfile(payload: FormData | Partial<User>) {
    return apiClient.patch<ApiResponse<User>>("/user/me", payload);
  }

  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return apiClient.patch<ApiResponse<null>>(
      "/user/change-password",
      payload,
    );
  }

  updateRole(id: string, role: Role) {
    return apiClient.patch<ApiResponse<User>>(
      `/user/${id}/role`,
      { role },
    );
  }

  updateStatus(id: string, status: UserStatus) {
    return apiClient.patch<ApiResponse<User>>(
      `/user/${id}/status`,
      { status },
    );
  }

  updatePermissions(
    id: string,
    permissions: string[],
  ) {
    return apiClient.patch<ApiResponse<User>>(
      `/user/${id}/permissions`,
      { permissions },
    );
  }

  softDelete(id: string) {
    return apiClient.delete<ApiResponse<null>>(
      `/user/${id}`,
    );
  }

  restore(id: string) {
    return apiClient.patch<ApiResponse<User>>(
      `/user/${id}/restore`,
    );
  }

  permanentlyDelete(id: string) {
    return apiClient.delete<ApiResponse<null>>(
      `/user/${id}/permanent`,
    );
  }
}

export const userService = new UserService();