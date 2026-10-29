import type { User } from "./user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AdminChangePasswordPayload {
  userId: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}