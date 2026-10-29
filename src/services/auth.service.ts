import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload
} from "@/types";

class AuthService {
  login(payload: LoginPayload) {
    return apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload,
    );
  }

  refreshToken() {
    return apiClient.post<ApiResponse<null>>(
      "/auth/refresh-token",
    );
  }

  logout() {
    return apiClient.post<ApiResponse<null>>(
      "/auth/logout",
    );
  }

  changePassword(payload: ChangePasswordPayload) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/change-password",
      payload,
    );
  }

  adminChangePassword(userId: string, newPassword: string) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/admin-change-password",
      {
        userId,
        newPassword,
      },
    );
  }
  
  forgotPassword(payload: ForgotPasswordPayload) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/forgot-password",
      payload,
    );
  }
}

export const authService = new AuthService();